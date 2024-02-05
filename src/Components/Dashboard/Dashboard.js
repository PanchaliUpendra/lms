import React, {useContext, useState } from "react";
import './Dashboard.css';
import Sidenav from "../Sidenav/Sidenav";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MyContext from "../../MyContext";
import ReceiptIcon from '@mui/icons-material/Receipt';

// just checking the ckeditor is working or not
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Dashboard(){
    const sharedvalue = useContext(MyContext);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    
    //ck editor is completed, lest get data from it , thats it!!!
    // const [editorData,setEditorData] = useState('');
    // const handleEditorChange = (event, editor) => {
    //     const data = editor.getData();
    //     setEditorData(data);
    //     console.log('Editor content changed:', data);
    //   };
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
                    <div className="dashboard-display-employees">
                        {/* this div is for open and closed leads for last 6 months */}
                        {/* <div>
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorData}
                            onReady={(editor) => {
                                // You can store the "editor" and use it when needed.
                                console.log('Editor is ready to use!', editor);
                            }}
                            onChange={handleEditorChange}
                            />
                        </div> */}
                        {/* this div is for open and closed tickets for last 6 months */}
                        <div>

                        </div>
                    </div>

                </div>
            </div>
            
        </>
    );
}

export default Dashboard;