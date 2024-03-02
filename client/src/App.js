import './App.css';
import { useEffect, useState } from 'react';
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { RiArrowUpDownFill } from "react-icons/ri";


function App() {
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [datas, setDatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  const [sortKey, setSortKey] = useState([{
    key: 'sno',
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

  useEffect(() => {
    handleSort(sortKey);
  }, [sortKey]);


  const handleClick = (colname) => {
    if (sortKey.order === 'asc') {
      setSortKey({ key: colname, order: 'desc' });
    }
    else {
      setSortKey({ key: colname, order: 'asc' });
    }
    setCurrentPage(1);
  }

  const handleSort = (sortKey) => {
    fetch(`/sort?column=${sortKey.key}&order=${sortKey.order}`)
      .then(res => res.json())
      .then(data => {
        setDatas(data);
      })
  }

  const handlePageChange = (index) => {
    setCurrentPage(index);
    setSortKey({ key: null, order: 'asc' });
  }


  const handleSearch = (e) => {
    e.preventDefault();
    setSortKey({ key: 'sno', order: 'asc' });
    if (search !== '') {
      fetch(`/search?term=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(data => {
          setDatas(data);
        })
        .catch(error => {
          console.log("error occured", error);
          alert(error);
        });

      setSearch('');

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
            <h2>User's Data</h2>
            <form onSubmit={handleSearch}>
              <input type='text' placeholder='search name or location' value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className='search' type='submit' >Search</button>

              <select className='itemscount' defaultValue={20} onChange={(e) => {
                const intValue = parseInt(e.target.value);
                setDatas(originalData);
                setCurrentPage(1);
                setItemsPerPage(intValue);
                setSortKey({ key: 'sno', order: 'asc' });
              }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
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
                              : <RiArrowUpDownFill />
                          }
                        </div>
                      </th>
                    })

                  }
                </tr>
              </thead>
              <tbody>
                {

                  datas.slice((currentPage - 1) * itemsPerPage, ((currentPage - 1) * itemsPerPage) + itemsPerPage).map((item) => {
                    return <tr key={item.sno}>
                      <td>{item.sno}</td>
                      <td>{item.name}</td>
                      <td>{item.age}</td>
                      <td>{item.phone}</td>
                      <td>{item.location}</td>
                      <td>{item.time}</td>
                      <td>{item.date}</td>
                    </tr>
                  })

                }
              </tbody>
            </table>


            <div>
              {
                Array.from({ length: Math.ceil(datas.length / itemsPerPage) }, (_, index) => (
                  <button key={index} onClick={() => { handlePageChange(index + 1); }}
                    style={{ backgroundColor: currentPage === index + 1 ? 'white' : '#A0A0A0' }}
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
