import React, {useContext, useState } from "react";
import './Dashboard.css';
import Sidenav from "../Sidenav/Sidenav";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MyContext from "../../MyContext";
import ReceiptIcon from '@mui/icons-material/Receipt';



function Dashboard(){
    const sharedvalue = useContext(MyContext);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
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
                    {/* Dashboard starts from here */}

                    <div className="dashboard-show-all-workers">
                        {/* div one */}
                        <div>
                            <div className="dashboard-each-profile-div">
                                <PersonIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total managers</p>
                                <p>{sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='manager').length}</p>
                            </div>
                        </div>
                        {/* div two */}
                        <div>
                            <div className="dashboard-each-profile-div">
                                <PersonIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total employees</p>
                                <p>{sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='employee').length}</p>
                            </div>
                        </div>
                        {/* div three  */}
                        <div>
                            <div className="dashboard-each-profile-div">
                                <PersonIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total customers</p>
                                <p>{sharedvalue.workerskeys.filter(item=>sharedvalue.workersdata[item].role==='customer').length}</p>
                            </div>
                        </div>
                        {/* div four */}
                        <div>
                            <div className="dashboard-each-profile-div">
                                <PersonIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total leads</p>
                                <p>{sharedvalue.leadskeys.length}</p>
                            </div>
                        </div>
                        {/* div five */}
                        <div>
                            <div className="dashboard-each-profile-div">
                                <ReceiptIcon sx={{color:'white'}}/>
                            </div>
                            <div className="dashboard-each-profile-content-div">
                                <p>total tickets</p>
                                <p>{sharedvalue.ticketskeys.length}</p>
                            </div>
                        </div>
                    </div>
                    {/* dashboard workers display ends here */}

                    {/* last 6 months graph */}
                    <div className="dashboard-display-leads">
                        <div className="dashboard-display-leads-header">
                            <h1>Recent Leads</h1>
                            <div>
                                <input type='checkbox'/>
                                <label>Show All Leads</label>
                            </div>
                        </div>
                    </div>
                    {/* last 6 months graph  ends here*/}

                    {/* recent tickets starts here */}
                    <div className="dashboard-display-leads">
                        <div className="dashboard-display-leads-header">
                            <h1>Recent Tickets</h1>
                            <div>
                                <input type='checkbox'/>
                                <label>Show All Leads</label>
                            </div>
                        </div>
                    </div>
                    {/* recent tickets ends here */}
                </div>
            </div>
            
        </>
    );
}

export default Dashboard;