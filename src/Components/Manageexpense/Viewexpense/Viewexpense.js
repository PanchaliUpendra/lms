import React, {useContext, useState } from "react";
import './Viewexpense.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
function Viewexpense(){
    const sharedvalue = useContext(MyContext);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    // search bar input 
    const [searchworker,setsearchworker]=useState('');
    console.log(searchworker);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    return(
        <>
            
            <div className='manlead-con'>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            <SearchIcon />
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* table view part starts from here!!! */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>View Expense</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Customer/ExpID" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div>
                            {/* table starts from here */}
                            <div className="view-list-table-con">
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
                                            <th>Exp.ID</th>
                                            <th>
                                                <p>from</p>
                                                <p>date /time/ place</p>
                                            </th>
                                            <th>
                                                <p>to</p>
                                                <p>date /time/ place</p>
                                            </th>
                                            <th>mode</th>
                                            <th>Transport cost</th>
                                            <th>food cost</th>
                                            <th>purpose</th>
                                            <th>customer name</th>
                                            <th>remark</th>
                                            <th>amount paid</th>
                                            <th>amount pending</th>
                                            <th>final amount</th>
                                            <th>date added</th>
                                            <th>action</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                         </div>
                    </div>
                    {/* table view part ends here */}

                </div>
                {/* mange con inner ends here */}
            </div>
        </>
    );
}

export default Viewexpense;