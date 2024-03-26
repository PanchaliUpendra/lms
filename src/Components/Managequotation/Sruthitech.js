import React, {useEffect, useState } from 'react';
import { Document , Page, Text, View, StyleSheet, Image} from '@react-pdf/renderer';
import { Font } from "@react-pdf/renderer";
// import { PDFViewer } from '@react-pdf/renderer';
// import { useParams } from 'react-router-dom';
import OpenSansBold from "../../Assets/open-sans/OpenSans-ExtraBold.ttf";
import OpenSansRegular from "../../Assets/open-sans/OpenSans-Regular.ttf";
import OpenSansSemibold from "../../Assets/open-sans/OpenSans-Semibold.ttf";
import numWords from 'num-words';
import Comaaslogo from '../../Assets/comaaslogo.png';

import sruthilogo from '../../Assets/sruthilogo.png';
import stamp from '../../Assets/stamp.jpeg';
// import MyContext from '../../MyContext';


const Sruthitech = (props) => {
    const sharedvalue = props.sharedvalue;
    // const sharedvalue = useContext(MyContext);
    // const {quoteid} = useParams();
    // const [quoteid,setquoteid] = useState(props.quoteid);
    //changing number to text
    const quoteid = props.quoteid
    const [text,settext] = useState('');
    const [wogsttext,setwogsttext] = useState('');
    const [totalcntigst,settotalcntigst] = useState(0); //total with gst
    const [basicamount,setbasicamount] = useState(0);//basic total in first row
    const [onlygst,setonlygst]  = useState(0);//only gst display here
    const [clearingexp,setclearingexp] = useState(0);//clearing expenses in second row total
    const [totalwogst, settotalwogst] = useState(0); //total without gst
    const [ccked,setccked] = useState('heelo')


    const [todaydate , settodaydate] = useState('');//storing the today here
    const [curryear, setcurryear] = useState('');//current year
    Font.register({
        family: "OpenSans",
        fonts: [
        {
            src: OpenSansRegular,
            fontWeight: 400,
        },
        {
            src:OpenSansSemibold,
            fontWeight:600,
        },
        {
            src: OpenSansBold,
            fontWeight: 700,
        },
        
        ]
    });

     
  useEffect(()=>{
    const today = new Date();

  // Extract day, month, and year
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  setcurryear(year);

  // Concatenate to form DD/MM/YYYY format
  const formattedDate = `${day}/${month}/${year}`;
  settodaydate(formattedDate);

  //number to string commas
  function numberwithcommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
}
const parser = new DOMParser();
 

  //calculating the data
  if(sharedvalue.quoteskeys.length>0 && sharedvalue.quoteskeys.includes(quoteid)===true){

    const doc = parser.parseFromString(sharedvalue.quotesdata[quoteid].quotpayterm, "text/html");

    // Extract the text content from the first child element (assuming it's the paragraph)
    const textContent = doc.body.firstChild ? doc.body.firstChild.textContent : '';
    setccked(textContent)
    //basic amount
    var ba = (Number(sharedvalue.quotesdata[quoteid].quotunits)*Number(sharedvalue.quotesdata[quoteid].quotprice)*Number(sharedvalue.quotesdata[quoteid].quotcon));
    var ba1 = numberwithcommas(ba)
    setbasicamount(ba1);

    //clearing expenses * no. of unikts
    var ce = (Number(sharedvalue.quotesdata[quoteid].quotclearing)*Number(sharedvalue.quotesdata[quoteid].quotunits));
    var ce1 = numberwithcommas(ce)
    setclearingexp(ce1);


    //total without gst
    var twg = (Number(sharedvalue.quotesdata[quoteid].quotunits)*Number(sharedvalue.quotesdata[quoteid].quotprice)*Number(sharedvalue.quotesdata[quoteid].quotcon))+(Number(sharedvalue.quotesdata[quoteid].quotclearing)*Number(sharedvalue.quotesdata[quoteid].quotunits));
    var twg1 = numberwithcommas(twg);
    settotalwogst(twg1)

    //only gst
    var gst = 0.18*((Number(sharedvalue.quotesdata[quoteid].quotunits)*Number(sharedvalue.quotesdata[quoteid].quotprice)*Number(sharedvalue.quotesdata[quoteid].quotcon))+(Number(sharedvalue.quotesdata[quoteid].quotclearing)*Number(sharedvalue.quotesdata[quoteid].quotunits)));
    var gst1 = numberwithcommas(gst);
    setonlygst(gst1);

    //total with gst
    var dv = 0.18*((Number(sharedvalue.quotesdata[quoteid].quotunits)*Number(sharedvalue.quotesdata[quoteid].quotprice)*Number(sharedvalue.quotesdata[quoteid].quotcon))+(Number(sharedvalue.quotesdata[quoteid].quotclearing)*Number(sharedvalue.quotesdata[quoteid].quotunits)))+
    (Number(sharedvalue.quotesdata[quoteid].quotunits)*Number(sharedvalue.quotesdata[quoteid].quotprice)*Number(sharedvalue.quotesdata[quoteid].quotcon))+(Number(sharedvalue.quotesdata[quoteid].quotclearing)*Number(sharedvalue.quotesdata[quoteid].quotunits));


    var tempdata = Math.round(dv);
    var tempdata1 = numberwithcommas(tempdata);
    settotalcntigst(tempdata1);
    const textvalue = numWords(tempdata);
    settext(textvalue);

    var wogsttemptext = numWords(twg);
    setwogsttext(wogsttemptext);

  }
  },[sharedvalue.quotesdata,sharedvalue.quoteskeys,quoteid]);
  return(
        // <PDFViewer style={styles.container}>
        <>
       
            {sharedvalue.quoteskeys.length>0 && sharedvalue.leadskeys.length>0 && 
            <Document>
                {/* first page desinging */}
                <Page size='A4' style={styles.page}>
                    <View style={styles.section}>
                        <View style={{display:'flex',flexDirection:'row', alignItems:'center',justifyContent:'space-between',
                            paddingBottom:10, borderBottom:0.5,borderBottomColor:'gray'}}>
                            <Image src={sruthilogo} style={{width:250,height:'auto'}}/>
                            {/* <Text style={styles.sruthitechhead}>Sruthi technologies</Text> */}
                            <View style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:7}}>
                                <Image src={Comaaslogo} style={{width:70,height:'auto'}}/>
                                <Text style={{fontSize:10, marginTop:4, fontWeight:400, fontFamily:'OpenSans',textAlign:'right'}}>GST No:37AAGFL0910L1ZC</Text>
                                <Text style={{fontSize:9,marginTop:2,  fontWeight:600, fontFamily:'OpenSans',textAlign:'right' ,color:'#D904C7'}}>Mobile:+91- 9440031617 </Text>
                            </View>
                        </View>

                        
                        <Text style={styles.quotationhead}>{Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "quotperfomaiorquot")? (sharedvalue.quotesdata[quoteid].quotperfomaiorquot==='Performa Invoice'?'Performa Invoice':'Quotation'):'Quotation'}</Text>
                        <Text style={{fontWeight:400,fontFamily:'OpenSans', fontSize:10,textAlign:'right',marginTop:2}}>Date: {todaydate}</Text>
                        <Text style={{fontWeight:600,fontFamily:'OpenSans', fontSize:10,textAlign:'right'}}>Q.NO. <Text style={{fontWeight:400}}>S360-{curryear}-{quoteid}</Text></Text>
                        

                        <View style={{fontWeight:400,fontFamily:'OpenSans',fontSize:10, marginTop:3}}>
                            <Text>To</Text>
                            <Text>{sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].custcompanyname},</Text>
                            <Text>{sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].ofdcty}, {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].ofddst},</Text>
                            <Text>{sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].ofdst} - {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].ofdpinc}</Text>
                        </View>

                        <View style={{fontWeight:400,fontFamily:'OpenSans',fontSize:10, textAlign:'center', marginTop:8,marginBottom:8}}>
                            <Text>Kind Attn: (Mr) {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].contperson}</Text>
                            <Text>Mobile : {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].contmobilenum} {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].altcontmobile!==''?'/':''} {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].altcontmobile}</Text>
                            {/* <Text>Kind Attn: (Mr/Ms/Miss). {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].contperson}</Text> */}
                        </View>

                        <Text style={{fontFamily:'OpenSans',fontSize:10, fontWeight:400,marginTop:3}}>Sir,</Text>

                        <Text style={{fontFamily:'OpenSans',fontSize:10, fontWeight:400, textAlign:'center', marginTop:7, marginBottom:7}}>Sub: {Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "quotperfomaiorquot")? (sharedvalue.quotesdata[quoteid].quotperfomaiorquot==='Performa Invoice'?'Performa Invoice':'Quotation'):'Quotation'} for COMAS Sorter:-Reg</Text>

                        <Text style={styles.thankyoumsg}>
                            Thank you very much for your interest in our products. We are here by offering our best price for world best quality COMAS BRAND Sortex for {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].businesstype} mill.
                             The details as follows.
                        </Text>

                        <View style={styles.srthtablecon}>
                            <View style={styles.srthtblrow}>
                                <Text style={styles.srthtblcol1}>Sno</Text>
                                <Text style={styles.srthtblcol2}>Description</Text>
                                <Text style={styles.srthtblcol3}>Capacity</Text>
                                <Text style={styles.srthtblcol3}>Qty</Text>
                                <Text style={styles.srthtblcol3}>Price in INR</Text>
                            </View>
                            <View style={styles.srthtblrow}>
                                <Text style={styles.srthtblcol11}>1</Text>
                                <View style={styles.srthtblcol21}>
                                    <Text>COMAS Color Sorter</Text>
                                    <Text>for {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].businesstype} with spares kit.</Text>
                                    <Text>Model: {sharedvalue.quotesdata[quoteid].quotmachinetype}-{sharedvalue.quotesdata[quoteid].quotcap}</Text>
                                </View>
                                <Text style={styles.srthtblcol31}>{Number(sharedvalue.quotesdata[quoteid].quotcap)===14?14:Number(sharedvalue.quotesdata[quoteid].quotcap)} {Number(sharedvalue.quotesdata[quoteid].quotcap)===14?'':'-'} {Number(sharedvalue.quotesdata[quoteid].quotcap)===14?'':Number(sharedvalue.quotesdata[quoteid].quotcap)+1} Tons/Hr</Text>
                                <View style={styles.srthtblcol31}>
                                    <Text>{Number(sharedvalue.quotesdata[quoteid].quotunits)} Unit USD</Text>
                                    <Text>{Number(sharedvalue.quotesdata[quoteid].quotprice)}@{Number(sharedvalue.quotesdata[quoteid].quotcon)}</Text>
                                </View>
                                <Text style={styles.srthtblcol31}>{basicamount}/-</Text>
                            </View>

                            <View style={styles.srthtblrow}>
                                <Text style={styles.srthtblcol11}>2</Text>
                                <View style={styles.srthtblcol21}>
                                    <Text>Clearing Expenses at</Text>
                                    <Text>ports & transportation</Text>
                                </View>
                                <Text style={styles.srthtblcol31}></Text>
                                {/* <View style={styles.srthtblcol31}>
                                </View> */}
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>{Number(sharedvalue.quotesdata[quoteid].quotunits)}*{Number(sharedvalue.quotesdata[quoteid].quotclearing)}</Text>
                                <Text style={styles.srthtblcol31}>{clearingexp}/-</Text>
                            </View>

                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderBottom:0,borderRight:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderBottom:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderBottom:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Total</Text>
                                <Text style={styles.srthtblcol31}>{totalwogst}/-</Text>
                            </View>

                            {Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "withgstornot") ? (sharedvalue.quotesdata[quoteid].withgstornot!=='Without GST' &&
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderBottom:0,borderRight:0,borderTop:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderBottom:0,borderTop:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderBottom:0,borderTop:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Gst@18%</Text>
                                <Text style={styles.srthtblcol31}>{onlygst}/-</Text>
                            </View>):
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderBottom:0,borderRight:0,borderTop:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderBottom:0,borderTop:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderBottom:0,borderTop:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Gst@18%</Text>
                                <Text style={styles.srthtblcol31}>{onlygst}/-</Text>
                            </View>
                            }
                            
                            {Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "withgstornot") ? (sharedvalue.quotesdata[quoteid].withgstornot!=='Without GST'?
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderRight:0,borderTop:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderTop:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderTop:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Grand total</Text>
                                <Text style={styles.srthtblcol31}>{
                                    totalcntigst
                                    }/-</Text>
                            </View>:
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderRight:0,borderTop:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderTop:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderTop:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Grand total</Text>
                                <Text style={styles.srthtblcol31}>{
                                    totalwogst
                                    }/-</Text>
                            </View>)
                            :
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderRight:0,borderTop:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderTop:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderTop:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Grand total</Text>
                                <Text style={styles.srthtblcol31}>{
                                    totalcntigst
                                    }/-</Text>
                            </View>}


                        </View>
                        {Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "withgstornot") ? (sharedvalue.quotesdata[quoteid].withgstornot!=='Without GST'?
                        <Text style={styles.numbertorupees}>({text} rupees only)</Text>:<Text style={styles.numbertorupees}>({wogsttext} rupees only)</Text>):
                        <Text style={styles.numbertorupees}>({text} rupees only)</Text>}

                        {/* <Text style={styles.numbertorupees}>({text} rupees only)</Text> */}

                        <Text style={{fontFamily:'OpenSans',fontWeight:600, textDecoration:'underline', fontSize:12}}>Terms and conditions:</Text>

                        <View style={styles.termscondstxt}>
                        
                            {/* <Text>1.  price of Rs. {totalcntigst}/- is to be paid to Sruthi Technologies.</Text> */}
                            {Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "withgstornot") ? (sharedvalue.quotesdata[quoteid].withgstornot!=='Without GST'?
                            <Text>* FOR Price Rs. {totalcntigst}/- to be paid to Sruthi Technologies.</Text>:<Text>* FOR Price Rs. {totalwogst}/- to be paid to Sruthi Technologies.</Text>):
                            <Text>* FOR Price Rs. {totalcntigst}/- to be paid to Sruthi Technologies.</Text>}
                            {/* <Text>* FOR Price Rs. {totalcntigst}/- to be paid to Sruthi Technologies.</Text> */}
                            {Object.prototype.hasOwnProperty.call(sharedvalue.quotesdata[quoteid], "withgstornot") ? (sharedvalue.quotesdata[quoteid].withgstornot!=='Without GST'?
                            <Text>* Sale through Gst sales.</Text>:<></>):
                            <Text>* Sale through Gst sales.</Text>}
                            {/* <Text>* Sale through Gst sales.</Text> */}
                            <Text>* Customs duty and clearing expanses and Transportation are above Mentioned.</Text>
                        </View>

                        <View style={styles.sruthibottomcon}>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'gray'}}>Plot No.289, Adity Nagar, Kukatpally, Hyderabad-500072 INDIA.</Text>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'#D904C7',marginTop:4}}>Email: <Text style={{color:'blue' ,textDecoration:'underline'}}>sun.sortex@gmail.com</Text> , <Text style={{color:'blue' ,textDecoration:'underline'}}>https://ultrasorters.com</Text> , www.sruthitechnologies.com</Text>
                        </View>
                        
                    </View>
                </Page>

                {/* second page designing */}
                <Page size='A4' style={styles.page}>
                    <View style={styles.section}>
                        <View style={{display:'flex',flexDirection:'row', alignItems:'center',justifyContent:'space-between',
                            paddingBottom:10, borderBottom:0.5,borderBottomColor:'gray'}}>
                            <Image src={sruthilogo} style={{width:250,height:'auto'}}/>
                            {/* <Text style={styles.sruthitechhead}>Sruthi technologies</Text> */}
                            <View style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:7}}>
                                <Image src={Comaaslogo} style={{width:70,height:'auto'}}/>
                                {/* <Text style={{fontSize:10, marginTop:4, fontWeight:400, fontFamily:'OpenSans',textAlign:'right'}}>GST No:37AAGFL0910L1ZC</Text> */}
                                {/* <Text style={{fontSize:9,marginTop:2,  fontWeight:600, fontFamily:'OpenSans',textAlign:'right' ,color:'#D904C7'}}>Mobile: {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].contmobilenum} {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].altcontmobile!==''?'/':''} {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].altcontmobile}</Text> */}
                                <Text style={{fontSize:9,marginTop:2,  fontWeight:600, fontFamily:'OpenSans',textAlign:'right' ,color:'#D904C7'}}>Mobile:+91- 9440031617 </Text>
                            </View>
                        </View>

                        <Text style={{fontFamily:'OpenSans', fontSize:11, fontWeight:600, textDecoration:'underline', marginTop:30}}>Payment</Text>

                        <View style={{fontFamily:'OpenSans',fontWeight:400, fontSize:11, marginTop:10, paddingLeft:20}}>
                            {/* <Text>1. 25% Advance</Text>
                            <Text>2. 50% Before delivery</Text>
                            <Text>3. 25% After installation</Text> */}
                            <Text>{ccked}</Text>
                        </View>

                        <Text style={{fontFamily:'OpenSans', fontWeight:400, fontSize:11, marginTop:7, marginBottom:0}}>*** ADDITIONAL NOTE: USD vs Rupee conversion changes, Price also will change.</Text>
                        <Text style={{fontFamily:'OpenSans', fontWeight:400, fontSize:11, marginTop:0, marginBottom:7}}>*** NOTE: If customer delayed for taking delivery , clearing expanses will increases.</Text>
                        

                        <Text style={{fontFamily:'OpenSans', fontWeight:600, fontSize:11, textDecoration:'underline'}}>1. Bank Details: </Text>
                        <Text style={{fontFamily:'OpenSans', fontWeight:600, fontSize:10, marginTop:4}}>Sruthi Technologies, HDFC Bank, Account.No.50200030537582, Ifsc-HDFC0001639, Tulasi Nagar, Kukatpally.</Text>

                        <Text style={styles.steheader}>Delivery:</Text>
                        <Text style={styles.stetext}>60 days from date of receipt of payment</Text>

                        <Text style={styles.steheader}>Warranty:</Text>
                        <Text style={styles.stetext}>Warranty is effective for {sharedvalue.quotesdata[quoteid].quotwarranty} years from the date of commissioning by our technician in customer's factory. In delay of commissioning schedule or without commissioning, 
                            the warranty may be effective for 1 month from shipment date. Warranty includes the replacement of the faulty parts. Warranty shall nbot include wear and tear parts and except
                            basic spare parts supplied freely , as well as damages caused by buyer because unexpected or careless operation and maintenance of the machine and any similar reasons.
                        </Text>

                        <Text style={styles.steheader}>Capacity</Text>
                        <Text style={styles.stetext}>
                            Capacity will depends on type of contamination, percantage of contamination and type of material. The capacity mentioned in this quotation based on 5% contamination with
                            Indian Dal/Spices without stones/foreign material.
                        </Text>

                        <Text style={styles.steheader}>Validty</Text>
                        <Text style={styles.stetext}>
                            90 days from date of advance amount.
                        </Text>

                        <Text style={{fontFamily:'OpenSans', fontWeight:400, fontSize:11,marginTop:10}}>For Sruthi Technologies.</Text>
                        <Image src={stamp} style={{width:100,height:'auto' , marginTop:10, marginLeft:10}}/>

                        <View style={styles.sruthibottomcon}>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'gray'}}>Plot No.289, Adity Nagar, Kukatpally, Hyderabad-500072 INDIA.</Text>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'#D904C7',marginTop:4}}>Email: <Text style={{color:'blue' ,textDecoration:'underline'}}>sun.sortex@gmail.com</Text> , <Text style={{color:'blue' ,textDecoration:'underline'}}>https://ultrasorters.com</Text> , www.sruthitechnologies.com</Text>
                        </View>
                    </View>
                </Page>
            </Document>
             }
            </>
          //</PDFViewer>
  );
};
const styles = StyleSheet.create({
    //stetext
    stetext:{
        marginTop:6,
        fontFamily:'OpenSans',
        fontWeight:400,
        fontSize:11
    },
    //steheader
    steheader:{
        fontFamily:'OpenSans', 
        fontWeight:600, 
        fontSize:11, 
        textDecoration:'underline',
        marginTop:10
    },
    //sruthibottomcon
    sruthibottomcon:{
        padding:5,
        borderTop:'0.3px solid gray',
        position:'absolute',
        bottom:10,
        width:'100%',
        left:10
    },
    //termscondstxt
    termscondstxt:{
        fontFamily:'OpenSans',
        fontSize:10,
        fontWeight:400,
        marginTop:10,
        paddingLeft:10
    },
    //numbertorupees
    numbertorupees:{
        fontFamily:'OpenSans',
        fontWeight:600,
        textTransform:'capitalize',
        fontSize:10,
        marginTop:10,
        marginBottom:10
    },
    //srthtblcol11
    srthtblcol11:{
        width:'120px',
        border:'0.3px solid gray',
        padding:8,
        fontSize:9,
        fontFamily:'OpenSans',
        fontWeight:400,
        borderBottom:'none'
    },
    //srthtblcol21
    srthtblcol21:{
        width:'100%',
        fontFamily:'OpenSans',
        fontSize:9,
        fontWeight:400,
        border:'0.3px solid gray',
        padding:8,
        borderBottom:'none'
    },
    //srthtblcol31
    srthtblcol31:{
        width:'230px',
        fontSize:9,
        fontFamily:'OpenSans',
        fontWeight:400,
        border:'0.3px solid gray',
        padding:8,
        borderBottom:'none'
    },
    //srthtblcol3
    srthtblcol3:{
        width:'230px',
        border:'0.3px solid gray',
        padding:8,
        fontSize:10,
        fontFamily:'OpenSans',
        fontWeight:600
    },
    //srthtblcol2
    srthtblcol2:{
        padding:8,
        border:'0.3px solid gray',
        width:'100%',
        fontSize:10,
        fontFamily:'OpenSans',
        fontWeight:600
    },
    //srthtblcol1
    srthtblcol1:{
        width:'120px',
        border:'0.3px solid gray',
        padding:8,
        fontSize:10,
        fontFamily:'OpenSans',
        fontWeight:600
    },
    //srthtblrow
    srthtblrow:{
        display:'flex',
        flexDirection:'row',
    },
    srthtablecon:{
        border:'0.5px solid gray',
        marginTop:10,
        width:'100%'
    },
    thankyoumsg:{
        fontFamily:'OpenSans',
        fontWeight:400,
        fontSize:10,
        marginBottom:7
    },
    quotationhead:{
        marginTop:24,
        marginBottom:24,
        textAlign:'center',
        fontWeight:600,
        fontSize:12,
        textTransform:'capitalize',
        fontFamily:'OpenSans',
        textDecoration:'underline'
    },
    sruthitechhead:{
        fontWeight:600,
        fontFamily:'OpenSans',
        color:'red',
        textTransform:'uppercase',
        textAlign:'center',
        fontSize:14
    },
    container:{
        width:'100%',
        height:'100vh'
    },
    page: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width:'100%',
        height:'100vh'
        
      },
      section: {
        margin: 20,
        padding: 10,
        flexGrow: 1,
        border:0,
        borderColor:'black',
        position:'relative'
      },
})

export default Sruthitech;