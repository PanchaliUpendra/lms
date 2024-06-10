import React ,{ useEffect,useState} from 'react';
import {Document , Page , Text , View , StyleSheet , Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
// import { PDFViewer } from '@react-pdf/renderer';
import OpenSansBold from "../../Assets/open-sans/OpenSans-ExtraBold.ttf";
import OpenSansRegular from "../../Assets/open-sans/OpenSans-Regular.ttf";
import OpenSansSemibold from "../../Assets/open-sans/OpenSans-Semibold.ttf";
import numWords from 'num-words';
import Comaaslogo from '../../Assets/comaaslogo.png';
import sruthilogo from '../../Assets/sruthilogo.png';
import stamp from '../../Assets/stamp.jpeg';
// import { useParams } from 'react-router-dom';
// import MyContext from '../../MyContext';

const Sparequote = (props) =>{
    // const {spareid} = useParams();
    const sharedvalue = props.sharedvalue;
    const spareid = props.spareid;
    // const sharedvalue = props.sharedvalue;
    // const sharedvalue = useContext(MyContext);
    const [todaydate,settodaydate] = useState('');
    const [total,settotal] = useState(0);
    const [gst,setgst] = useState(0);
    const [gtotal,setgtotal] =useState(0);
    const [text,settext] = useState('');
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
     
      // Concatenate to form DD/MM/YYYY format
      const formattedDate = `${day}/${month}/${year}`;
      settodaydate(formattedDate);

      if(sharedvalue.spareskeys.length>0 && sharedvalue.spareskeys.includes(spareid)===true){
        let temp_total =0;
        const temp=sharedvalue.sparesdata[spareid].spares;
        for(let i=0;i<temp.length;i++){
            temp_total+=(Number(temp[i].qty)*Number(temp[i].unitprice));
        }
        settotal(temp_total);
        const temp_gst = (18*temp_total)/100;
        setgst(temp_gst);
        const temp_gt = temp_gst+temp_total;
        setgtotal(temp_gt);
        let temp_gt2 = Math.round((temp_gst+temp_total));
        const textvalue = numWords(temp_gt2);
        settext(textvalue);

      }
    },[sharedvalue.sparesdata,sharedvalue.spareskeys, spareid]);

    return(
        // <PDFViewer style={styles.container}>
            <>
            {sharedvalue.spareskeys.length>0 && 
                <Document>
                    <Page size='A4' style={styles.page}>
                        <View style={styles.section}>
                        <View style={{display:'flex',flexDirection:'row', alignItems:'center',justifyContent:'space-between',
                            paddingBottom:10, borderBottom:0.5,borderBottomColor:'gray'}}>
                            <Image src={sruthilogo} style={{width:250,height:'auto'}}/>
                            {/* <Text style={styles.sruthitechhead}>Sruthi technologies</Text> */}
                            <View style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:7}}>
                                <Image src={Comaaslogo} style={{width:70,height:'auto'}}/>
                                <Text style={{fontSize:10, marginTop:4, fontWeight:400, fontFamily:'OpenSans',textAlign:'right'}}>GST No:37AAGFL0910L1ZC</Text>
                                <Text style={{fontSize:9,marginTop:2,  fontWeight:600, fontFamily:'OpenSans',textAlign:'right' ,color:'#D904C7'}}>Mobile:+91-9440031617/8332999919 </Text>
                            </View>
                        </View>
                        <Text style={styles.quotationhead}>{sharedvalue.sparesdata[spareid].sparequottype}</Text>
                        <Text style={{fontWeight:400,fontFamily:'OpenSans', fontSize:10,textAlign:'right',marginTop:2}}>Date: {todaydate}</Text>

                        <View style={{fontWeight:400,fontFamily:'OpenSans',fontSize:10, marginTop:3}}>
                            <Text>To</Text>
                            <Text>{sharedvalue.sparesdata[spareid].companyname!=='other'?sharedvalue.sparesdata[spareid].companyname:sharedvalue.sparesdata[spareid].othercompanyname},</Text>
                            <Text>{sharedvalue.sparesdata[spareid].sparecity} , {sharedvalue.sparesdata[spareid].sparedist},</Text>
                            <Text>{sharedvalue.sparesdata[spareid].sparestate} ,{sharedvalue.sparesdata[spareid].sparecountry}.</Text>
                        </View>

                        <Text style={{fontFamily:'OpenSans',fontSize:10, fontWeight:400,marginTop:3}}>Sir,</Text>

                        <Text style={{fontFamily:'OpenSans',fontSize:10, fontWeight:400, textAlign:'center', marginTop:7, marginBottom:7}}>Sub: {sharedvalue.sparesdata[spareid].sparequottype} for COMAS Sorter:-Reg</Text>

                        <Text style={styles.thankyoumsg}>
                            Thank you very much and we are here by offering out best price for COMAS {sharedvalue.sparesdata[spareid].sparereqmachine} Spares . The details as Follows
                        </Text>

                        <View style={styles.srthtablecon}>
                            <View style={styles.srthtblrow}>
                                <Text style={styles.srthtblcol1}>Sno</Text>
                                <Text style={styles.srthtblcol2}>Description</Text>
                                <Text style={styles.srthtblcol3}>Qty</Text>
                                <Text style={styles.srthtblcol3}>Unit Price in Rs</Text>
                                <Text style={styles.srthtblcol3}>Total Price</Text>
                            </View>
                            {sharedvalue.sparesdata[spareid].spares.map((item,idx)=>(
                                <View style={styles.srthtblrow}>
                                <Text style={styles.srthtblcol11}>{idx+1}</Text>
                                <View style={styles.srthtblcol21}>
                                    <Text>{item.sparepart}</Text>
                                </View>
                                <Text style={styles.srthtblcol31}>{item.qty}</Text>
                                <View style={styles.srthtblcol31}>
                                    <Text>{item.unitprice}</Text>
                                </View>
                                <Text style={styles.srthtblcol31}>{Number(item.unitprice)*Number(item.qty)}/-</Text>
                            </View>
                            ))}
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderBottom:0,borderRight:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderBottom:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderBottom:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Total</Text>
                                <Text style={styles.srthtblcol31}>{total}/-</Text>
                            </View>
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderBottom:0,borderRight:0,borderTop:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderBottom:0,borderTop:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderBottom:0,borderTop:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Gst@18%</Text>
                                <Text style={styles.srthtblcol31}>{gst}/-</Text>
                            </View>
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderRight:0,borderTop:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderTop:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderTop:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Grand total</Text>
                                <Text style={styles.srthtblcol31}>{gtotal}/-</Text>
                            </View>
                        </View>
                        <Text style={styles.numbertorupees}>({text} rupees only)</Text>
                        <Text style={{fontFamily:'OpenSans', fontWeight:400, fontSize:10, marginTop:-5 , marginBottom:5,paddingLeft:10}}>1. 100% payment to be done before dispatch</Text>
                        <Text>
                            <Text style={{fontFamily:'OpenSans', fontWeight:600, fontSize:11, textDecoration:'underline'}}>Bank Details: </Text>
                            <Text style={{fontFamily:'OpenSans', fontWeight:600, fontSize:10, marginTop:4}}>Sruthi Technologies, HDFC Bank, Account.No.50200030537582, Ifsc-HDFC0001639, Vivekananda Nagar ,Tulasi Nagar.</Text>
                        </Text>
                        <Text style={{fontFamily:'OpenSans', fontWeight:400, fontSize:9,marginTop:10}}>For Sruthi Technologies.</Text>
                        <Image src={stamp} style={{width:50,height:'auto' , marginTop:10, marginLeft:10}}/>

                        <View style={styles.sruthibottomcon}>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'gray'}}>Plot No. 68, H.No. 2-23-S-68, Adity Nagar, Kukatpally, Hyderabad-500072 INDIA.</Text>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'#D904C7',marginTop:4}}>Email: <Text style={{color:'blue' ,textDecoration:'underline'}}>sun.sortex@gmail.com</Text> , <Text style={{color:'blue' ,textDecoration:'underline'}}>https://ultrasorters.com</Text> , www.sruthitechnologies.com</Text>
                        </View>
                        </View>
                    </Page>
                </Document>
                }
            </>
        // </PDFViewer>
    )
}

export const styles = StyleSheet.create({
    numbertorupees:{
        fontFamily:'OpenSans',
        fontWeight:600,
        textTransform:'capitalize',
        fontSize:10,
        marginTop:10,
        marginBottom:10
    },
    srthtblcol31:{
        width:'230px',
        fontSize:9,
        fontFamily:'OpenSans',
        fontWeight:400,
        border:'0.3px solid gray',
        padding:8,
        borderBottom:'none'
    },
    srthtblcol21:{
        width:'100%',
        fontFamily:'OpenSans',
        fontSize:9,
        fontWeight:400,
        border:'0.3px solid gray',
        padding:8,
        borderBottom:'none'
    },
    srthtblcol11:{
        width:'120px',
        border:'0.3px solid gray',
        padding:8,
        fontSize:9,
        fontFamily:'OpenSans',
        fontWeight:400,
        borderBottom:'none'
    },
    srthtblcol3:{
        width:'230px',
        border:'0.3px solid gray',
        padding:8,
        fontSize:10,
        fontFamily:'OpenSans',
        fontWeight:600
    },
    srthtblcol2:{
        padding:8,
        border:'0.3px solid gray',
        width:'100%',
        fontSize:10,
        fontFamily:'OpenSans',
        fontWeight:600
    },
    srthtblcol1:{
        width:'120px',
        border:'0.3px solid gray',
        padding:8,
        fontSize:10,
        fontFamily:'OpenSans',
        fontWeight:600
    },
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
    sruthibottomcon:{
        padding:5,
        borderTop:'0.3px solid gray',
        position:'absolute',
        bottom:10,
        width:'100%',
        left:10
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

export default Sparequote;