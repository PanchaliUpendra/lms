import React ,{  useEffect,useState} from 'react';
import {Document , Page , Text , View , Image } from '@react-pdf/renderer';
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
import { styles } from './Sparequote';

const Amcquote = (props)=>{
    // const {amcid} = useParams();
    const amcid = props.amcid;
    const sharedvalue = props.sharedvalue;
    // const sharedvalue = useContext(MyContext);
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

    const[todaydate,settodaydate] = useState('');
    const[grandtotal,setgrandtotal] = useState(0);
    const[text,settext] = useState('');

    useEffect(()=>{
        const today = new Date();
        // Extract day, month, and year
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        // Concatenate to form DD/MM/YYYY format
        const formattedDate = `${day}/${month}/${year}`;
        settodaydate(formattedDate);

        if(sharedvalue.amckeys.length>0 && sharedvalue.amckeys.includes(amcid)===true){
            let temp_total =0;
            temp_total+=(Number(sharedvalue.amcdata[amcid].amcunitprice)*Number(sharedvalue.amcdata[amcid].amcqty));
            let gstprice = (18*temp_total)/100;
            temp_total+=gstprice;
            temp_total= Math.round(temp_total);
            setgrandtotal(temp_total);
            
            const textvalue = numWords(temp_total);
            settext(textvalue);
        }

    },[sharedvalue.amcdata,sharedvalue.amckeys,amcid]);

    return(
        // <PDFViewer style={styles.container}>
        <>
            {
                sharedvalue.amckeys.length>0 &&
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

                        <Text style={styles.quotationhead}>{sharedvalue.amcdata[amcid].amcquottype}</Text>
                        <Text style={{fontWeight:400,fontFamily:'OpenSans', fontSize:10,textAlign:'right',marginTop:2}}>Date: {todaydate}</Text>

                        <View style={{fontWeight:400,fontFamily:'OpenSans',fontSize:10, marginTop:3}}>
                            <Text>To</Text>
                            <Text>{sharedvalue.amcdata[amcid].amccompanyname},</Text>
                            <Text>{sharedvalue.amcdata[amcid].amccity},{sharedvalue.amcdata[amcid].amcdistrict},</Text>
                            <Text>{sharedvalue.amcdata[amcid].amcstate}, {sharedvalue.amcdata[amcid].amccountry}.</Text>
                            {/* <Text>{sharedvalue.sparesdata[spareid].sparestate} ,{sharedvalue.sparesdata[spareid].sparecountry}.</Text> */}
                        </View>

                        <Text style={{fontFamily:'OpenSans',fontSize:10, fontWeight:400,marginTop:3}}>Sir,</Text>

                        <Text style={{fontFamily:'OpenSans',fontSize:10, fontWeight:400, textAlign:'center', marginTop:7, marginBottom:7}}>Sub: {sharedvalue.amcdata[amcid].amcquottype} for COMAS {sharedvalue.amcdata[amcid].amcmachine}:-Reg</Text>

                        <Text style={styles.thankyoumsg}>
                            Thank you very much for your interest on our products. We are here by offering our best price for AMC of COMAS BRAND {sharedvalue.amcdata[amcid].amcmachine} Machine . the details as follow
                        </Text>

                        <View style={styles.sruthibottomcon}>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'gray'}}>Plot No. 68, H.No. 2-23-S-68, Adity Nagar, Kukatpally, Hyderabad-500072 INDIA.</Text>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'#D904C7',marginTop:4}}>Email: <Text style={{color:'blue' ,textDecoration:'underline'}}>sun.sortex@gmail.com</Text> , <Text style={{color:'blue' ,textDecoration:'underline'}}>https://ultrasorters.com</Text> , www.sruthitechnologies.com</Text>
                        </View>

                        <View style={styles.srthtablecon}>
                            <View style={styles.srthtblrow}>
                                <Text style={styles.srthtblcol1}>Sno</Text>
                                <Text style={styles.srthtblcol2}>Description</Text>
                                <Text style={styles.srthtblcol3}>Price per Unit</Text>
                                <Text style={styles.srthtblcol3}>Qty</Text>
                                <Text style={styles.srthtblcol3}>Price in Rs.</Text>
                            </View>
                            <View style={styles.srthtblrow}>
                                <Text style={styles.srthtblcol11}>1</Text>
                                <View style={styles.srthtblcol21}>
                                    <Text>COMAS Make {sharedvalue.amcdata[amcid].amcmachine} AMC Charges for tenure of {sharedvalue.amcdata[amcid].amcperiod} months</Text>
                                </View>
                                <Text style={styles.srthtblcol31}>{sharedvalue.amcdata[amcid].amcunitprice}/-</Text>
                                <View style={styles.srthtblcol31}>
                                    <Text>{sharedvalue.amcdata[amcid].amcqty}</Text>
                                </View>
                                <Text style={styles.srthtblcol31}>{Number(sharedvalue.amcdata[amcid].amcunitprice)*Number(sharedvalue.amcdata[amcid].amcqty)}/-</Text>
                            </View>
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderBottom:0,borderRight:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderBottom:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderBottom:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Total</Text>
                                <Text style={styles.srthtblcol31}>{Number(sharedvalue.amcdata[amcid].amcunitprice)*Number(sharedvalue.amcdata[amcid].amcqty)}/-</Text>
                            </View>
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderBottom:0,borderRight:0,borderTop:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderBottom:0,borderTop:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderBottom:0,borderTop:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Gst@18%</Text>
                                <Text style={styles.srthtblcol31}>{Number(sharedvalue.amcdata[amcid].amcunitprice)*Number(sharedvalue.amcdata[amcid].amcqty)*0.18}/-</Text>
                            </View>
                            <View style={styles.srthtblrow}>
                                <Text style={{...styles.srthtblcol11,borderRight:0,borderTop:0}}></Text>
                                <View style={{...styles.srthtblcol21,borderLeft:0,borderRight:0,borderTop:0}}>
                                </View>
                                <Text style={{...styles.srthtblcol31,borderLeft:0,borderTop:0}}></Text>
                                <Text style={{...styles.srthtblcol3,fontWeight:400}}>Grand total</Text>
                                <Text style={styles.srthtblcol31}>{grandtotal}/-</Text>
                            </View>
                        </View>
                        <Text style={styles.numbertorupees}>({text} rupees only)</Text>
                        <Text style={styles.mediumboldtext}>Terms and Conditions:</Text>
                        <Text style={styles.mediumboldtextpoints}><Text>1. </Text>Price Rs.{grandtotal}/- to be paid to Sruthi Technologies.</Text>
                        <Text style={styles.mediumboldtextpoints}><Text>2. </Text>100% payment along with order confirmation.</Text>
                        <Text style={styles.mediumboldtextpoints}><Text>3. </Text>Consideration of the above service , the owner shall pay to the contractor , in advance a servicecharge of Rs {Number(sharedvalue.amcdata[amcid].amcunitprice)*Number(sharedvalue.amcdata[amcid].amcqty)}/-</Text>
                        <Text style={styles.mediumboldtextpoints}><Text>4. </Text>The agreement will commence on {todaydate} and shall continue  for a period of {sharedvalue.amcdata[amcid].amcperiod} months thereafter.</Text>
                        <Text style={styles.mediumboldtextpoints}><Text>5. </Text>During the visit the engineer will check , adjust & when necessary repaired on chargeable basis.(Spare parts an y required during repaired on chargable basis only).</Text>
                        <Text style={styles.mediumboldtextpoints}><Text>6. </Text>{sharedvalue.amcdata[amcid].amcvisit} Compulsary Visits in a year for providing preventive maintaine and visits During AMC.</Text>
                    </View>
                    </Page>
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
                            <Text style={styles.mediumboldtextpoints}><Text>7. </Text>Except for as otherwise specified in this agreement , the responsibilities of the contractor shall cease</Text>
                            <Text style={styles.mediumboldtextpoints}><Text></Text>( if the said sortex is damaged or malfunction as result of ):</Text>
                            <Text style={styles.mediumboldtextpoints}><Text style={{textTransform:'none'}}>a{`)`}. </Text>Any examination or adjustment of ntampering with machine by any person other than contractor.</Text>
                            <Text style={styles.mediumboldtextpoints}><Text style={{textTransform:'none'}}>b{`)`}. </Text>Defects in the electrical installation and wiring of fluctuation of power supply at the place of operation. </Text>
                            <Text style={styles.mediumboldtextpoints}><Text>8. </Text>The contractor shall not be liable for any loss, damage, injury or delay due to the cause beyond its</Text>

                            <Text style={styles.bankdetails}>our A/C Details</Text>
                            <Text style={styles.mediumboldtextpoints}><Text style={styles.bankdetails}>Name</Text> - sruthi Technologies</Text>
                            <Text style={styles.bankdetails}>AC NO. - 50200030537582</Text>
                            <Text style={styles.bankdetails}>IFSC CODE -HDFC0007698</Text>
                            <Text style={styles.bankdetails}>BANK-HDFC</Text>



                            <Text style={{fontFamily:'OpenSans', fontWeight:400, fontSize:9,marginTop:10}}>For Sruthi Technologies.</Text>
                            <Image src={stamp} style={{width:100,height:'auto' , marginTop:10, marginLeft:10}}/>




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


export default Amcquote;
