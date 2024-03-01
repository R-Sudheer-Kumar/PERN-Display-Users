import './App.css';
import { useEffect, useState } from 'react';
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";



function App() {
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [datas, setDatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalData , setOriginalData] = useState(null);

  const [sortKey, setSortKey] = useState([{
    key: null,
    order: 'asc',
  }]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = (() => {
    setLoading(true);
    fetch('/data')
      .then(response => response.json())
      .then(data => {
        setDatas(data);
        setOriginalData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        alert("Error");
      });
  });

  useEffect(() => {
    fetchData();
  }, []);


  function convertAndSplitDateTime(datetimeString) {
    const dateObject = new Date(datetimeString);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth()).toString().padStart(2, '0');
    const date = dateObject.getDate().toString().padStart(2, '0');
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    const seconds = dateObject.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${date}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return [formattedDate, formattedTime];
  }

  const handleClick = (colname) => {
    if (sortKey.order === 'asc') {
      setSortKey({ key: colname, order: 'desc' });
    }
    else {
      setSortKey({ key: colname, order: 'asc' });
    }
  }

  const sorted = (data) => {
    const sodata = data.sort((a, b) => {
      const timeA = new Date(a['created_at']);
      const timeB = new Date(b['created_at']);

      if (sortKey.key === 'date') {
        const dateA = new Date(timeA.getFullYear(), timeA.getMonth(), timeA.getDate());
        const dateB = new Date(timeB.getFullYear(), timeB.getMonth(), timeB.getDate());
        return sortKey.order === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortKey.key === 'time') {
        const timeOnlyA = timeA.getHours() * 3600 + timeA.getMinutes() * 60 + timeA.getSeconds();
        const timeOnlyB = timeB.getHours() * 3600 + timeB.getMinutes() * 60 + timeB.getSeconds();
        return sortKey.order === 'asc' ? timeOnlyA - timeOnlyB : timeOnlyB - timeOnlyA;
      }
    });
    return sodata;
  }

  const handlePageChange = (index) => {
    setCurrentPage(index);
    setSortKey({ key: null, order: 'asc' });
  }


  const handleSearch = (e) => {
    e.preventDefault();

    if (search !== '' ) {

      const filterData = originalData.filter((item) => {
        return ['name', 'location'].some((column) => {
          return item[column].toString().toLowerCase().includes(search.toLowerCase());
        })
      });
      setSearch('');
      setDatas(filterData);
    }
    else {
      setDatas(originalData);
    }
  }

  return (
    <div className='home'>
      {
        !loading ?
          <>
            <h1>User's Data</h1>
            <form onSubmit={handleSearch}>
              <input type='text' placeholder='search name or location' value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className='search' type='submit' >Search</button>

              <select className='itemscount' onChange={(e) => {
                const intValue = parseInt(e.target.value);
                setDatas(originalData);
                setCurrentPage(1);
                setItemsPerPage(intValue);
                
              }}>
                <option value={10}>10</option>
                <option selected value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
              </select>
            </form>

            <table>
              <thead>
                <tr>
                  <th>sno</th>
                  <th>name</th>
                  <th>age</th>
                  <th>phone</th>
                  <th>location</th>
                  {
                    ['time', 'date'].map((obj) => {
                      return <th onClick={() => handleClick(obj)} >
                        <div className='nameIcon' key={obj}>
                          {obj}
                          {
                            sortKey.key === obj ?
                              sortKey.order === 'asc' ? <FaArrowUp /> : <FaArrowDown />
                              : ''

                          }
                        </div>
                      </th>
                    })

                  }
                </tr>
              </thead>
              <tbody>
                {

                  sorted((datas.slice((currentPage - 1) * itemsPerPage, ((currentPage - 1) * itemsPerPage) + itemsPerPage))).map((item) => {
                    const datetimeString = item.created_at;
                    const [date, time] = convertAndSplitDateTime(datetimeString);
                    return <tr key={item.sno}>
                      <td>{item.sno}</td>
                      <td>{item.name}</td>
                      <td>{item.age}</td>
                      <td>{item.phone}</td>
                      <td>{item.location}</td>
                      <td>{time}</td>
                      <td>{date}</td>
                    </tr>
                  })

                }
              </tbody>
            </table>


            <div>
              {
                Array.from({ length: Math.ceil(datas.length / itemsPerPage) }, (_, index) => (
                  <button key={index} onClick={() => { handlePageChange(index + 1); }}
                    style={{ backgroundColor: currentPage === index + 1 ? 'white' : 'gray' }}
                  >
                    {index + 1}
                  </button>
                )
                )
              }

            </div>

          </>
          : "loading....."
      }
    </div>
  );
}

export default App;
