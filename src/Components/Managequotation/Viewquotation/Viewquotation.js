import React, {useContext, useState } from "react";
import './Viewquotation.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";

function Viewquotation(){
    const sharedvalue = useContext(MyContext);
    // search bar input 
    const [searchworker,setsearchworker]=useState('');
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    return(
        <>
            <div className={`manlead-con`}>
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
                    {/* your createmanager starts from here */}
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
                                    <input type='text' placeholder="Customer/QuoteID" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div>
                            {/* search ends here */}
                            {/* table starts from here */}
                                <div className="view-list-table-con">
                                        <table>
                                            <thead>
                                                <tr className="table-head-row">
                                                    <th>quote.ID</th>
                                                    <th>quotation customer</th>
                                                    <th>machine model</th>
                                                    <th>quotation type</th>
                                                    <th>usertype</th>
                                                    <th>chute</th>
                                                    <th>type</th>
                                                    <th>price</th>
                                                    <th>payment</th>
                                                    <th>pay.term</th>
                                                    <th>warranty</th>
                                                    <th>company name</th>
                                                    <th>add.info</th>
                                                    <th>status</th>
                                                    <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    sharedvalue.quoteskeys.length>0 && 
                                                    sharedvalue.quoteskeys.filter((item)=>JSON.stringify(item).includes(searchworker)||sharedvalue.quotesdata[item].quotcustname.includes(searchworker)).map((quote,idx)=>(
                                                        <tr key={idx}>
                                                            {/* 1. quote id */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {quote}
                                                                </p>
                                                            </td>
                                                            {/* 2. quotation customer */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotcustname}
                                                                </p>
                                                            </td>
                                                            {/* 3. machine model */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotmachinetype}
                                                                </p>
                                                            </td>
                                                            {/* 4.quotation type*/}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quottype}
                                                                </p>
                                                            </td>
                                                            {/* 5. usertype */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    -
                                                                </p>
                                                            </td>
                                                            {/* 6.chute */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.leadsdata[sharedvalue.quotesdata[quote].quotlead].chutes}
                                                                </p>
                                                            </td>
                                                            {/* 7. price */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotprice}
                                                                </p>
                                                            </td>
                                                            {/* 8.product type */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotprodtype}
                                                                </p>
                                                            </td>
                                                            {/* 9. payment */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotpayment}
                                                                </p>
                                                            </td>
                                                            {/* 10. payment term */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    -
                                                                </p>
                                                            </td>
                                                            {/* 11. warranty */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotwarranty}
                                                                </p>
                                                            </td>
                                                            {/* 12. company name */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotcompanyname}
                                                                </p>
                                                            </td>
                                                            {/* 13. add.info */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotaddinfo}
                                                                </p>
                                                            </td>
                                                            {/* 14. status */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    -
                                                                </p>
                                                            </td>
                                                            {/* 15.  action*/}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    -
                                                                </p>
                                                            </td>

                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                </div>
                                {/* table ends here */}
                        </div>
                        {/* list ends here */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Viewquotation;