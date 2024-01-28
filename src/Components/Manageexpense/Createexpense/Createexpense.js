import React, {useContext, useState } from "react";
import './Createexpense.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
function Createexpense(){
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
                    {/* your createexpense starts from here */}
                    <div className='create-lead-con'>
                        <div className='each-lead-head-comes-here'>
                            <h1>Create Expense</h1>
                        </div>
                        {/* expense sheet form starts here */}
                        <div className='expense-sheet-form-con'>
                            <div className='create-lead-requirements-head'>
                                <h1>Expense Sheet</h1>
                            </div>
                            <div className='create-lead-requirements-head-inner'>
                                <h1>From</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                    <div>
                                        <label>Date</label>
                                        <input type='date'  />
                                    </div>
                                    <div>
                                        <label>Time</label>
                                        <input type='time'  />
                                    </div>
                                    <div>
                                        <label>Place</label>
                                        <input type='text'  />
                                    </div>
                            </div>
                            
                            {/* mode ,food and cost */}
                            

                        </div>
                        {/* to comes here */}
                        <div className='expense-sheet-form-con'>
                            {/*expense sheet form starts here*/}
                            <div className='create-lead-requirements-head-inner'>
                                <h1>To</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                    <div>
                                        <label>Date</label>
                                        <input type='date'  />
                                    </div>
                                    <div>
                                        <label>Time</label>
                                        <input type='time'  />
                                    </div>
                                    <div>
                                        <label>Place</label>
                                        <input type='text'  />
                                    </div>
                            </div>
                        </div>
                        {/* mode food and cost comes here */}
                        <div className='expense-sheet-form-con'>
                                <div className='create-lead-requirements-all-fields'>
                                    <div>
                                        <label>Mode</label>
                                        <input type='text'  />
                                    </div>
                                    <div>
                                        <label>Transport Cost</label>
                                        <input type='number'  />
                                    </div>
                                    <div>
                                        <label>Food Cost</label>
                                        <input type='number'  />
                                    </div>
                                    <div>
                                        <label>Purpose</label>
                                        <input type='text'  />
                                    </div>
                                    <div>
                                        <label>Amount Paid</label>
                                        <input type='number'  />
                                    </div>
                                    <div>
                                        <label>Amount Pending</label>
                                        <input type='number'  />
                                    </div>
                                    <div>
                                        <label>Customer Name</label>
                                        <input type='text'  />
                                    </div>
                                    
                                </div>
                               
                        </div>
                        <div className='create-expense-remarks-div'>
                            <label>Remarks</label>
                            <textarea type='text'  />
                        </div>
                        {/* create lead button starts here */}
                        <div className='create-expense-submit-btns'>
                            <button >create lead</button>
                        </div>
                        {/* create lead button ends here */}
                    </div>
                    {/* your create expenmse ends here */}
                </div>
            </div>
        </>
    );
}

export default Createexpense;