import React,{useContext, useState} from "react";
import './CreateAmc.css';

import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import { useNavigate } from "react-router-dom";
import MyContext from "../../../MyContext";

function CreateAmc(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();

    const[amcdata,setamcdata] = useState({
        amcquottype:'',
        amccompanyname:'',
        amccountry:'',
        amcstate:'',
        amcdistrict:'',
        amccity:'',
        amcmachine:'',
        amcperiod:'',
        amcunitprice:'',
        amcqty:'',
        amcvisit:''
    })
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
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
                            <SearchIcon onClick={()=>navigate('/search')}/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createmanager starts from here */}
                    <form className='create-lead-con'>
                        <div className='create-lead-head'>
                            <h1>Create AMC</h1>
                        </div>
                        <div className="create-quotation-form-starts-here">
                            <div className='create-lead-requirements-all-fields creatquotation-forms'>
                                {/* quotation type */}
                                <div>
                                    <label>Performa Invoice or Quotation<span style={{color:'red'}}>*</span></label>
                                    <select value={amcdata.amcquottype} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcquottype:e.target.value
                                    }))}>
                                        <option value=''>Select Quotation Type</option>
                                        <option value='Performa Invoice'>Performa Invoice</option>
                                        <option value='Quotation'>Quotation</option>
                                    </select>
                                </div>
                                {/*enter your company name */}
                                <div>
                                    <label>Enter your Company Name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amccompanyname} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amccompanyname:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your country */}
                                <div>
                                    <label>country<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amccountry} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amccountry:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your state */}
                                <div>
                                    <label>state<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amcstate} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcstate:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your district */}
                                <div>
                                    <label>district<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amcdistrict} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcdistrict:e.target.value
                                    }))}/>
                                </div>
                                {/*enter your city/town/village */}
                                <div>
                                    <label>enter city/town/village name<span style={{color:'red'}}>*</span></label>
                                    <input type="text" value={amcdata.amccity} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amccity:e.target.value
                                    }))}/>
                                </div>
                                {/*spares required of which machine */}
                                <div>
                                    <label>Machine<span style={{color:'red'}}>*</span></label>
                                    <select value={amcdata.amcmachine} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcmachine:e.target.value
                                    }))}>
                                        <option value=''>Choose machine</option>
                                        <option value='Sorter'>Sorter</option>
                                        <option value='Packing Machine'>Packing Machine</option>
                                        <option value='Classifer'>Classifer</option>
                                        <option value='Destoner'>Destoner</option>
                                        <option value='Cyclone'>Cyclone</option>
                                        <option value='Airlock'>Airlock</option>
                                        <option value='Elevator'>Elevator</option>
                                        <option value='Rubber Rolls'>Rubber Rolls</option>
                                        <option value='Emery stoner'>Emery stoner</option>
                                        <option value='Air Compressor'>Air Compressor</option>
                                        <option value='UPS'>UPS</option>
                                        <option value='Complete Projects'>Complete Projects</option>
                                        <option value='Grain Dryers'>Grain Dryers</option>
                                    </select>
                                </div>
                                {/*AMC Period */}
                                <div>
                                    <label>AMC Period(months)<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcperiod} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcperiod:e.target.value
                                    }))}/>
                                </div>
                                {/*price per unit */}
                                <div>
                                    <label>price per unit<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcunitprice} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcunitprice:e.target.value
                                    }))}/>
                                </div>
                                {/* qty */}
                                <div>
                                    <label>quantity<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcqty} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcqty:e.target.value
                                    }))}/>
                                </div>
                                {/* visits */}
                                <div>
                                    <label>visits<span style={{color:'red'}}>*</span></label>
                                    <input type="number" value={amcdata.amcvisit} onChange={(e)=>setamcdata(prev=>({
                                        ...prev,
                                        amcvisit:e.target.value
                                    }))}/>
                                </div>

                            </div>
                            <button className="creatquotation-final-button" >
                                create AMC
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateAmc;