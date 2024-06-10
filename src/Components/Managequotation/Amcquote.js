import React ,{ useContext, useEffect,useState} from 'react';
import {Document , Page , Text , View , StyleSheet , Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import OpenSansBold from "../../Assets/open-sans/OpenSans-ExtraBold.ttf";
import OpenSansRegular from "../../Assets/open-sans/OpenSans-Regular.ttf";
import OpenSansSemibold from "../../Assets/open-sans/OpenSans-Semibold.ttf";
import numWords from 'num-words';
import Comaaslogo from '../../Assets/comaaslogo.png';
import sruthilogo from '../../Assets/sruthilogo.png';
import stamp from '../../Assets/stamp.jpeg';
import { useParams } from 'react-router-dom';
import MyContext from '../../MyContext';
import { styles } from './Sparequote';

const Amcquote = ()=>{
    const {amcid} = useParams();
    const sharedvalue = useContext(MyContext);
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

    return(
        <PDFViewer style={styles.container}>
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

                        <Text style={styles.quotationhead}>Quotation</Text>
                        <Text style={{fontWeight:400,fontFamily:'OpenSans', fontSize:10,textAlign:'right',marginTop:2}}>Date: 01/06/2024</Text>

                        <View style={{fontWeight:400,fontFamily:'OpenSans',fontSize:10, marginTop:3}}>
                            <Text>To</Text>
                            <Text>company name,</Text>
                            <Text>Address</Text>
                            {/* <Text>{sharedvalue.sparesdata[spareid].sparestate} ,{sharedvalue.sparesdata[spareid].sparecountry}.</Text> */}
                        </View>

                        <Text style={{fontFamily:'OpenSans',fontSize:10, fontWeight:400,marginTop:3}}>Sir,</Text>

                        <Text style={{fontFamily:'OpenSans',fontSize:10, fontWeight:400, textAlign:'center', marginTop:7, marginBottom:7}}>Sub: quotation/performa voice for COMAS Sorter:-Reg</Text>

                        <Text style={styles.thankyoumsg}>
                            Thank you very much and we are here by offering out best price for COMAS  Spares . The details as Follows
                        </Text>

                        <View style={styles.sruthibottomcon}>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'gray'}}>Plot No. 68, H.No. 2-23-S-68, Adity Nagar, Kukatpally, Hyderabad-500072 INDIA.</Text>
                            <Text style={{fontWeight:600,textAlign:'center',fontSize:10,fontFamily:'OpenSans',color:'#D904C7',marginTop:4}}>Email: <Text style={{color:'blue' ,textDecoration:'underline'}}>sun.sortex@gmail.com</Text> , <Text style={{color:'blue' ,textDecoration:'underline'}}>https://ultrasorters.com</Text> , www.sruthitechnologies.com</Text>
                        </View>
                    </View>
                    </Page>
                </Document>
            }
        </>
        </PDFViewer>
    )
}


export default Amcquote;
