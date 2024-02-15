import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet ,Image} from '@react-pdf/renderer';
import { Font } from "@react-pdf/renderer";
import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import OpenSansBold from "../../Assets/open-sans/OpenSans-ExtraBold.ttf";
import OpenSansRegular from "../../Assets/open-sans/OpenSans-Regular.ttf";
import OpenSansSemibold from "../../Assets/open-sans/OpenSans-Semibold.ttf";
import Rgb from '../../Assets/rgb.png';
import { first } from './Comaascss';
import numWords from 'num-words';
const Comaasrgb = () => {
  //changing number to text
  const number = 1450;
  const text = numWords(number);
  
  const {quoteid} = useParams();
  const [todaydate , settodaydate] = useState('');//storing the today here
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
  },[]);
    return(
        <PDFViewer style={styles.container}>
                <Document>
                  {/* first page desinging */}
                    <Page size='A4' style={styles.page}>
                      <View style={styles.section}>
                          <Text style={styles.logo}>COMAAS</Text>
                          
                          <Text style={styles.quoteid}>PI No.{quoteid}</Text>
                          <View style={styles.issuedDate}>
                            <Text>Issued By J.E</Text>
                            <Text style={{fontSize:9,fontWeight:400}}>Date: {todaydate}</Text>
                          </View>
                          <Text style={styles.quotationhead}>Quotation</Text>
                          {/* images comes here */}
                          <View style={styles.rgbImageView}>
                            <Image src={Rgb} style={styles.rgbimage} />
                          </View>
                          
                          <View style={first.page1}>
                            <View style={first.section1}>
                              <View style={first.p1sec121}>
                                <Text style={styles.customerInfo}>Customer:</Text></View>
                              <View style={first.p1sec122}>
                                <Text style={styles.customerInfo121}>Saanvika Software Solutions, Madinaguda</Text>
                                <Text style={styles.customerInfoContPer}>Kind Attn: Pavan Kumar</Text>
                              </View>
                            </View>
                            <View style={first.section1}>
                              <View style={first.p1sec121}>
                                <Text style={styles.customerInfo}>Project:</Text>
                              </View>
                              <View style={first.p1sec122}>
                                <Text style={{fontSize:11,fontWeight:400,fontFamily:'OpenSans'}}>192 <Text style={{color:'red' ,fontWeight:600,textTransform:'capitalize'}}>channels</Text> <Text style={{color:'red',fontWeight:600}}>R</Text><Text style={{color:'green',fontWeight:600}}>G</Text><Text style={{color:'blue',fontWeight:600}}>B</Text> FULL <Text style={{color:'#5905B3',fontWeight:600,textTransform:'capitalize'}}>c</Text><Text style={{color:'green',fontWeight:600}}>o</Text><Text style={{color:'#5905B3',fontWeight:600}}>l</Text><Text style={{color:'blue',fontWeight:600}}>o</Text><Text style={{color:'#AB8B00',fontWeight:600}}>r</Text>
                                 <Text style={{color:'red' ,fontWeight:600,textTransform:'capitalize'}}> s</Text><Text style={{color:'green',fontWeight:600}}>o</Text><Text style={{color:'red',fontWeight:600}}>r</Text><Text style={{color:'red',fontWeight:600}}>t</Text><Text style={{color:'blue',fontWeight:600}}>e</Text><Text style={{color:'blue',fontWeight:600}}>r</Text> with Tri-Chroomatic <Text style={{color:'#5905B3',fontFamily:'OpenSans',fontWeight:700}}>CCD</Text> <Text style={{color:'red'}}>Camera</Text>,
                                <Text style={{color:'#028DE9',fontFamily:'OpenSans',fontWeight:600}}> LED</Text> lamps and 
                                <Text style={{color:'red' ,fontWeight:600 , textTransform:'capitalize'}}> real automatic calibration technology</Text></Text>

                                <Text style={styles.comaascoltd}>COMAAS Co.LTD</Text>
                                <Text style={styles.comaascoltdadds}>34, seongseo 5cha cheomdan-ro dalseo_gu, daegu, r.o.korea</Text>
                                <Text style={styles.indiaoffice}>india office</Text>
                                <Text style={styles.sruthitechname}>sruthi Technologies</Text>
                                <Text style={styles.sruthitechadd}>Plot No.289, Aditya nagar, kukatapally, hyderabad-500072</Text>
                                <Text style={styles.sruthitechphone}>Mobile.no:9440031617</Text>
                              </View>
                            </View>
                          </View>

                          <Text style={styles.tableeachheading}>1.price</Text>

                          <View style={first.pricetable}>
                            
                            <View style={styles.pricetableheaders}>
                              <View style={styles.pricetableeachhead1}>
                                <Text style={styles.tableheadertext}>SI.NO</Text>
                              </View>
                              <View style={styles.pricetableeachhead2}>
                                <Text style={styles.tableheadertext}>Description</Text>
                              </View>
                              <View style={styles.pricetableeachhead1}>
                                <Text style={styles.tableheadertext}>Qty</Text>
                              </View>
                              <View style={styles.pricetableeachhead3}>
                                <Text style={styles.tableheadertext}>Amount in USD</Text>
                              </View>
                            </View>

                            <View style={styles.pricetableheaders}>
                              <View style={styles.pricetableeachhead1}>
                                <Text style={styles.tableheadertext}>1</Text>
                              </View>
                              <View style={styles.pricetableeachhead2}>
                                <Text style={styles.tableheadertext1}>COLOR Sorter for channa dall with spares kit model: RGB-3</Text>
                                <Text style={styles.tableheadertext1}>Capacity:3-4 Ton/Hr</Text>
                                <Text style={styles.tableheadertext12}>includes: spare parts kit</Text>
                              </View>
                              <View style={styles.pricetableeachhead1}>
                                <Text style={styles.tableheadertext}>1Set</Text>
                              </View>
                              <View style={styles.pricetableeachhead3}>
                                <Text style={styles.tableheadertext}>1450/-</Text>
                              </View>
                            </View>


                            <View style={styles.pricetableheaders}>
                              <View style={styles.pricetableeachhead111}>
                                <Text style={styles.tableheadertext}></Text>
                              </View>
                              <View style={styles.pricetableeachhead21}>
                                <Text style={styles.tableheadertext}>Total CIF Chennai</Text>
                              </View>
                              <View style={styles.pricetableeachhead112}>
                                <Text style={styles.tableheadertext}></Text>
                              </View>
                              <View style={styles.pricetableeachhead3}>
                                <Text style={styles.tableheadertext}>1450/-</Text>
                              </View>
                            </View>

                          </View>
                          <Text style={styles.numtowrords}>(<Text>Total CIF Chennai USD </Text>{text} rupees only)</Text>

                          <View style={styles.bottomaddress}>
                            <Text style={styles.comaascoltd}>COMAAS Co.LTD</Text>
                            <Text style={styles.comaascoltdadds}>34, seongseo 5cha cheomdan-ro dalseo_gu, daegu, r.o.korea</Text>
                          </View>
                      </View>
                    </Page>

                    {/* second page desinging */}
                    <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text>Hello, World!</Text>
                        <Text>This is a dynamically generated PDF page.</Text>
                    </View>
                    </Page>

                    {/* third page desinginig  */}
                    <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text>Hello, World!</Text>
                        <Text>This is a dynamically generated PDF page.</Text>
                    </View>
                    </Page>
                </Document>
      </PDFViewer>
    )
};

const styles = StyleSheet.create({
    //bottomaddress
    bottomaddress:{
      position:'absolute',
      bottom:20,
      left:10,
    },
    //numtowrords
    numtowrords:{
      fontSize:10,
      fontWeight:600,
      fontFamily:'OpenSans',
      marginTop:7,
      marginBottom:5,
      textTransform:'capitalize'
    },
    //tableheadertext12
    tableheadertext12:{
      marginTop:10,
    },
    //tableheadertext1
    tableheadertext1:{
      textAlign:'left'
    },
    //pricetableeachhead21
    pricetableeachhead21:{
      width:'100%',
      border:'0.2px solid gray',
      padding:5,
      fontSize:10,
      fontWeight:600,
      fontFamily:'OpenSans',
      borderLeft:'none',
      borderRight:'none',
    },
    //total amount settings
    pricetableeachhead111:{
      padding:5,
      width:'70px',
      fontSize:10,
      fontWeight:600,
      fontFamily:'OpenSans',
      border:'0.2px solid gray',
      borderRight:'none',
    },
    pricetableeachhead112:{
      padding:5,
      width:'70px',
      fontSize:10,
      fontWeight:600,
      fontFamily:'OpenSans',
      border:'0.2px solid gray',
      borderLeft:'none',
    },
    //tableheadertext
    tableheadertext:{
      margin:'auto',
    },
   //price table  headers
   pricetableheaders:{
    display:'flex',
    flexDirection:'row',
    },
   //price table each header
   pricetableeachhead1:{
    padding:5,
    border:'0.2px solid gray',
    width:'70px',
    fontSize:10,
    fontWeight:600,
    fontFamily:'OpenSans',
  },
  pricetableeachhead2:{
      width:'100%',
      border:'0.2px solid gray',
      padding:5,
      fontSize:10,
      fontWeight:600,
      fontFamily:'OpenSans',
  },
  pricetableeachhead3:{
      
      border:'0.2px solid gray',
      padding:5,
      fontSize:10,
      fontWeight:600,
      fontFamily:'OpenSans',
      width:'150px'
  },
  //tableeachheading
  tableeachheading:{
    textTransform:'uppercase',
    fontFamily:'OpenSans',
    fontSize:12,
    fontWeight:400
  },
  //sruthitechphone
  sruthitechphone:{
    fontWeight:600,
    fontFamily:'OpenSans',
    textTransform:'capitalize',
    fontSize:11
  },
  //sruthitechadd
  sruthitechadd:{
    textTransform:'capitalize',
    fontWeight:400,
    fontFamily:'OpenSans',
    fontSize:11
  },
  //sruthitechname
  sruthitechname:{
    textTransform:'capitalize',
    color:'red',
    fontWeight:600,
    fontFamily:'OpenSans',
    fontSize:11,
  },
  //indiaoffice
  indiaoffice:{
    fontSize:11,
    fontWeight:600,
    textDecoration:'underline',
    fontFamily:'OpenSans',
    textTransform:'capitalize',
    marginTop:9
  },
  //comaascoltdadds
  comaascoltdadds:{
    fontSize:11,
    fontWeight:400,
    textTransform:'uppercase',
    fontFamily:'OpenSans'
  },
  //comaascoltd
  comaascoltd:{
    fontSize:11,
    fontWeight:700,
    fontFamily:'OpenSans',
    marginTop:5,
    marginBottom:2
  },
  // customerInfo121
  customerInfo121:{
    fontSize:11,
    fontFamily:'OpenSans',
    fontWeight:600,
    textAlign:'left'
  },
  //ends here
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
    border:1,
    borderColor:'black',
    position:'relative'
  },
  logo:{
    fontFamily: "OpenSans",
    fontSize: "16px",
    fontWeight:700,
    color:'#09A6D1'
  },
  quoteid:{
    textAlign:'center',
    fontSize:12,
  },
  quotationhead:{
  fontSize:14,
  fontWeight:600,
  textAlign:'center',
  fontFamily: "OpenSans",
  textDecoration:'underline',
  marginTop:5,
  },
  // issued date css
  issuedDate:{
    fontSize:8,
    fontWeight:400,
    fontFamily: "OpenSans",
    display:'flex',
    flexDirection:'column',
    alignItems:'flex-end',
  },
  //rgbImageView
  rgbImageView:{
    height:100,
    width:150,
    marginTop:12
  },
  //rgbimage
  rgbimage:{
    width:'100%',
    height:'100%',
    objectFit:'fill'
  }
  ,
  //customerInfo
  customerInfo:{
    fontSize:11,
    fontFamily:'OpenSans',
    fontWeight:600,
    textAlign:'right'
  },
  //customerInfoContPer
  customerInfoContPer:{
    fontSize:"8px",
    fontFamily:"OpenSans",
    fontWeight:400
  },
  //firstinfo section
  firstInfoSection:{
    width:'55%',
   
    display:'flex',
    flexDirection:'row',
  },
  //testing
  container1: {
    display: 'flex',
    flexDirection: 'row',
    width: '55%',
    
    fontSize: 14,
    flexWrap: 'wrap',// Allow text to wrap within the containers
    margin:'auto',
    marginTop:'5px',
    marginBottom:'5px'
  },
  customerInfo1: {
    marginLeft: 10, // Add some margin between elements
    fontSize:10,
    fontWeight:400,
    fontFamily:"OpenSans",
    marginRight:10
  },
  textContent: {
    flex: 1, // Allow the text to take available space within the container
    fontSize:10,
    fontFamily:'OpenSans',
    fontWeight:400
  },
  
});

export default  Comaasrgb;
