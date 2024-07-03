import React, { useContext, useState } from "react";
import './Profile.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../Sidenav/Sidenav";
import MyContext from "../../MyContext";
import { NavLink, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { createworkers, spareAndMachineDoc } from "../../Data/Docs";
import {  writeBatch } from "firebase/firestore";
import { db } from "../../Firebase";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


function Profile(){
    const sharedvalue = useContext(MyContext);
    

    const batch = writeBatch(db);
    const navigate = useNavigate();
    const [editmobile,seteditmobile] = useState('');
    const [editname,seteditname] = useState('');
    const[editmobbtn, seteditmobbtn] = useState(false);
    const [showprogress,setshowprogress]=useState(false);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

    //adding spare item
    const[showAddSpareItem,setShowAddSpareItem] = useState(false);
    const[spareitem,setspareitem] = useState({
        id:'',
        item:'',
        model:'',
        subtype:'',
        price:''
    });

    //adding machine item
    const[showAddMachineItem,setShowAddMachineItem] = useState(false);
    const[machineitem,setmachineitem] = useState({
        id:'',
        discreption:'',
        product:'',
        capacity:'',
        specification:'',
        price:''
    })

    async function modifymobile(){
        try{
            if(editmobile!=='' && editmobile.length>=5){
                batch.update(createworkers,{
                    [sharedvalue.uid]:{
                        ...sharedvalue.workersdata[sharedvalue.uid],
                        "cNum":editmobile,
                        "name":editname!==''?editname:sharedvalue.workersdata[sharedvalue.uid].name
                    }            
                });
                await batch.commit();
            }else{
                alert('check your mobile number...');
            }
        }catch(e){
            console.log('you got an error while updating the number...',e);
        }
    }

    //add the spares data
    async function handleAddSparesData(){
        setshowprogress(true);
        try{
            batch.update(spareAndMachineDoc,{
                "spares":[
                    ...sharedvalue.sparesArray,
                    {
                        ...spareitem,
                        id:sharedvalue.sparesArray.length+1
                    }
                ]
            })
            await batch.commit();
            setspareitem({
                id:'',
                item:'',
                model:'',
                subtype:'',
                price:''
            })
        }catch(err){
            console.log('you got an error while adding the spares data: ',err);
        }
        setshowprogress(false);
    }

    //add the machines data
    async function handleAddMachinesData(){
        setshowprogress(true);
        try{
            batch.update(spareAndMachineDoc,{
                "machines":[
                    ...sharedvalue.machinesArray,
                    {
                        ...machineitem,
                        id:sharedvalue.machinesArray.length+1
                    }
                ]
            })
            await batch.commit();
            setmachineitem({
                id:'',
                discreption:'',
                product:'',
                capacity:'',
                specification:'',
                price:''
            });
        }catch(err){
            console.log('you got an error while adding the machines data: ',err);
        }
        setshowprogress(false);
    }



   
    return(
        <>
        {sharedvalue.workerskeys.length>0 && sharedvalue.uid!=='' && 
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
                    {/* profile  starts from here */}
                    <div className="profile-starts-con">
                        
                    </div>
                    <div className="profile-info-div-outer">
                        <div className="profile-info-div">
                            <div className="profile-info-div-img">
                                <p>{sharedvalue.workersdata[sharedvalue.uid].name[0]}</p>
                            </div>
                            <div className="profile-info-div-details">
                                <div className="profile-info-div-details-name">
                                    <h1>{sharedvalue.workersdata[sharedvalue.uid].name}</h1>
                                    <p>{sharedvalue.workersdata[sharedvalue.uid].role}</p>
                                </div>
                                
                                <div className="profile-info-div-details-email">
                                    <p>Email: <span>{sharedvalue.workersdata[sharedvalue.uid].email}</span></p>
                                    <p>Phone: 
                                    <span>{Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "cNum") && sharedvalue.workersdata[sharedvalue.uid].cNum!==''?sharedvalue.workersdata[sharedvalue.uid].cNum:'123xxxx'}</span>
                                    {editmobbtn===false && <EditIcon size='large' sx={{color:'#0084ff',cursor:'pointer'}} onClick={()=>seteditmobbtn(true)}/>}
                                    </p>
                                    
                                </div>
                                {editmobbtn===true && 
                                    <div className="edit-mobile-number-div-buttons">
                                        <input placeholder="enter your name" type="text" value={editname} onChange={(e)=>seteditname(e.target.value)}/>
                                        <input placeholder="enter the mobile number" type='number' value={editmobile} onChange={(e)=>seteditmobile(e.target.value)}/>

                                        <div>
                                            <button onClick={()=>seteditmobbtn(false)}>cancel</button>
                                            <button onClick={()=>{
                                                modifymobile();
                                                seteditmobbtn(false);
                                            }}>update</button>
                                        </div>
                                    </div>

                                }
                                
                                {sharedvalue.role==='admin' && 
                                <div className="profile-show-passwords-btn">
                                    <NavLink to='/passwords'><p>View Credentials {`>`}</p></NavLink>
                                    <NavLink to='/adddocuments'><p>Add Documents {`>`}</p></NavLink>
                                </div>
                                }

                                
                            </div>
                        </div>
                        {sharedvalue.role==='admin' && 
                        <>
                        {/* spares table */}
                        <div className="profile-spares-div">
                            <div className="profile-spares-header">
                                <h1>spares table :-</h1>
                            </div>
                            <table className="profile-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Model</th>
                                        <th>subtype</th>
                                        <th>price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sharedvalue.sparesArray.length>0 && sharedvalue.sparesArray.map((item,idx)=>(
                                        <tr key={idx}>
                                            <td>{item.item}</td>
                                            <td>{item.model}</td>
                                            <td>{item.subtype}</td>
                                            <td>{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {!showAddSpareItem && <div className="spare-add-item-btn">
                            <p onClick={()=>setShowAddSpareItem(prev=>!prev)}>+ add spare</p>
                        </div>}
                        {showAddSpareItem &&
                        <>
                        <div className="each-form-header-spare-machine">
                            <h1>add spare item</h1>
                        </div>
                        <form className="profile-spare-form">
                            <div>
                                <label>item</label>
                                <input type="text" placeholder="Enter item Name..." value={spareitem.item} onChange={(e)=>setspareitem(prev=>({
                                    ...prev,
                                    item:e.target.value.toLowerCase()
                                }))}/>
                            </div>
                            <div>
                                <label>model</label>
                                <input type="text" placeholder="Enter Modal if any..." value={spareitem.model} onChange={(e)=>setspareitem(prev=>({
                                    ...prev,
                                    model:e.target.value.toLowerCase()
                                }))}/>
                            </div>
                            <div>
                                <label>sub type</label>
                                <input type="text" placeholder="Enter sub type if any..." value={spareitem.subtype} onChange={(e)=>setspareitem(prev=>({
                                    ...prev,
                                    subtype:e.target.value.toLowerCase()
                                }))}/>
                            </div>
                            <div>
                                <label>price</label>
                                <input type="number" placeholder="Price" value={spareitem.price} onChange={(e)=>setspareitem(prev=>({
                                    ...prev,
                                    price:e.target.value
                                }))}/>
                            </div>
                        </form>
                        </>
                        }
                        {showAddSpareItem && 
                        <div className="spare-add-item-btn" >
                            <p style={{backgroundColor:'red'}} onClick={()=>{
                                setShowAddSpareItem(prev=>!prev);
                            }}>cancle</p>
                            <p style={{backgroundColor:'green'}} onClick={()=>{
                                handleAddSparesData();
                                setShowAddSpareItem(prev=>!prev);
                            }}>Add item</p>
                        </div>}
                        {/* spares table ends here */}

                        </>}

                        {sharedvalue.role==='admin' &&
                        <>
                        {/* machine table */}
                        <div className="profile-spares-div">
                            <div className="profile-spares-header">
                                <h1>machinery table :-</h1>
                            </div>
                            <table className="profile-table">
                                <thead>
                                    <tr>
                                        <th>Discreption</th>
                                        <th>Product</th>
                                        <th>capacity(ton/hr)</th>
                                        <th>Specification</th>
                                        <th>price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sharedvalue.machinesArray.length>0 && sharedvalue.machinesArray.map((item,idx)=>(
                                        <tr key={idx}>
                                            <td>{item.discreption}</td>
                                            <td>{item.product}</td>
                                            <td>{item.capacity}</td>
                                            <td>{item.specification}</td>
                                            <td>{item.price}</td>
                                        </tr>
                                    ))}
                                    
                                </tbody>
                            </table>
                        </div>
                        {!showAddMachineItem && 
                        <div className="spare-add-item-btn">
                            <p onClick={()=>setShowAddMachineItem(prev=>!prev)}>+ add machine</p>
                        </div>
                        }
                        {showAddMachineItem &&
                        <>
                        <div className="each-form-header-spare-machine">
                            <h1>add machine item</h1>
                        </div>
                        <form className="profile-spare-form">
                            <div>
                                <label>Discreption</label>
                                <input type="text" placeholder="Enter Discreption..." value={machineitem.discreption} onChange={(e)=>setmachineitem(prev=>({
                                    ...prev,
                                    discreption:e.target.value.toLowerCase()
                                }))}/>
                            </div>
                            <div>
                                <label>Product</label>
                                <input type="text" placeholder="Enter Product if any..." value={machineitem.product} onChange={(e)=>setmachineitem(prev=>({
                                    ...prev,
                                    product:e.target.value.toLowerCase()
                                }))}/>
                            </div>
                            <div>
                                <label>capacity(ton/hr)</label>
                                <input type="number" placeholder="Enter capacity if any..." value={machineitem.capacity} onChange={(e)=>setmachineitem(prev=>({
                                    ...prev,
                                    capacity:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>Specification</label>
                                <input type="text" placeholder="Specification" value={machineitem.specification} onChange={(e)=>setmachineitem(prev=>({
                                    ...prev,
                                    specification:e.target.value.toLowerCase()
                                }))}/>
                            </div>
                             <div>
                                <label>Price</label>
                                <input type="number" placeholder="Price" value={machineitem.price} onChange={(e)=>setmachineitem(prev=>({
                                    ...prev,
                                    price:e.target.value
                                }))}/>
                            </div>
                        </form>
                        </>
                        }

                        {showAddMachineItem && 
                        <div className="spare-add-item-btn">
                            <p onClick={()=>setShowAddMachineItem(prev=>!prev)} style={{backgroundColor:'red'}}>cancle</p>
                            <p onClick={()=>{
                                handleAddMachinesData();
                                setShowAddMachineItem(prev=>!prev);
                            }} style={{backgroundColor:'green'}}>+ add item</p>
                        </div>
                        }
                        {/* machine table ends here */}
                         
                        </>
                        }

                    </div>
                    
                    {/* profile ends here */}
                </div>
            </div>
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showprogress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Profile;