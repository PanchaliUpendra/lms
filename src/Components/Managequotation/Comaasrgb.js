import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet ,Image} from '@react-pdf/renderer';
import { Font } from "@react-pdf/renderer";
// import { PDFViewer } from '@react-pdf/renderer';
// import { useParams } from 'react-router-dom';
import OpenSansBold from "../../Assets/open-sans/OpenSans-ExtraBold.ttf";
import OpenSansRegular from "../../Assets/open-sans/OpenSans-Regular.ttf";
import OpenSansSemibold from "../../Assets/open-sans/OpenSans-Semibold.ttf";
import Rgb from '../../Assets/rgb.png';
import { first } from './Comaascss';
import numWords from 'num-words';

const Comaasrgb = (props) => {
  const sharedvalue = props.sharedvalue;
  //changing number to text
  const [text,settext] = useState('')
  
  const quoteid = props.quoteid;
  const [todaydate , settodaydate] = useState('');//storing the today here
  const [curyear, setcuryear] = useState('');
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
  setcuryear(year);
  settodaydate(formattedDate);

  let number= Number(sharedvalue.quotesdata[quoteid].quotprice);
  let tempnum = numWords(number);
  settext(tempnum);
  },[sharedvalue.quotesdata, quoteid]);
    return(
        // <PDFViewer style={styles.container}>
        <>
       
            {sharedvalue.quoteskeys.length>0 && sharedvalue.leadskeys.length>0 && 
                <Document>
                  {/* first page desinging */}
                    <Page size='A4' style={styles.page}>
                      <View style={styles.section}>
                          <Text style={styles.logo}>COMAAS</Text>
                          
                          <Text style={styles.quoteid}>PI No.S360-{curyear}-{quoteid}</Text>
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
                                <Text style={styles.customerInfo121}>{sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].custcompanyname},</Text>
                                <Text style={styles.customerInfo121}>{sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].ofdcty}</Text>
                                <Text style={styles.customerInfoContPer}>Kind Attn: {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].contperson}</Text>
                              </View>
                            </View>
                            <View style={first.section1}>
                              <View style={first.p1sec121}>
                                <Text style={styles.customerInfo}>Project:</Text>
                              </View>
                              <View style={first.p1sec122}>
                                <Text style={{fontSize:11,fontWeight:400,fontFamily:'OpenSans'}}>{(sharedvalue.quotesdata[quoteid].quotmachinetype==='ULTIMA'||sharedvalue.quotesdata[quoteid].quotmachinetype==='RGBS')===true?Number(sharedvalue.quotesdata[quoteid].quotcap)*64:Number(sharedvalue.quotesdata[quoteid].quotcap)*42} <Text style={{color:'red' ,fontWeight:600,textTransform:'capitalize'}}>channels</Text> 
                                <Text style={{color:'red',fontWeight:600}}>R</Text><Text style={{color:'green',fontWeight:600}}>G</Text><Text style={{color:'blue',fontWeight:600}}>B</Text> FULL <Text style={{color:'#5905B3',fontWeight:600,textTransform:'capitalize'}}>c</Text><Text style={{color:'green',fontWeight:600}}>o</Text><Text style={{color:'#5905B3',fontWeight:600}}>l</Text><Text style={{color:'blue',fontWeight:600}}>o</Text><Text style={{color:'#AB8B00',fontWeight:600}}>r</Text>
                                 <Text style={{color:'red' ,fontWeight:600,textTransform:'capitalize'}}> s</Text><Text style={{color:'green',fontWeight:600}}>o</Text><Text style={{color:'red',fontWeight:600}}>r</Text><Text style={{color:'red',fontWeight:600}}>t</Text><Text style={{color:'blue',fontWeight:600}}>e</Text><Text style={{color:'blue',fontWeight:600}}>r</Text> with Tri-Chroomatic <Text style={{color:'#5905B3',fontFamily:'OpenSans',fontWeight:700}}>CCD</Text> <Text style={{color:'red'}}>Camera</Text>,
                                <Text style={{color:'#028DE9',fontFamily:'OpenSans',fontWeight:600}}> LED</Text> lamps and 
                                <Text style={{color:'red' ,fontWeight:600 , textTransform:'capitalize'}}> real automatic calibration technology</Text></Text>

                                <Text style={styles.comaascoltd}>COMAAS Co.LTD</Text>
                                <Text style={styles.comaascoltdadds}>34, seongseo 5cha cheomdan-ro dalseo_gu, daegu, r.o.korea</Text>
                                <Text style={styles.indiaoffice}>india office</Text>
                                <Text style={styles.sruthitechname}>sruthi Technologies</Text>
                                <Text style={styles.sruthitechadd}>Plot No. 68, H.No. 2-23-S-68, Aditya Nagar, Kukatpally,Hyderabad - 500 072.</Text>
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
                                <Text style={styles.tableheadertext1}>COLOR Sorter for {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].businesstype} with spares kit model: {sharedvalue.quotesdata[quoteid].quotmachinetype}-{sharedvalue.quotesdata[quoteid].quotmachinetype==='ULTRA-S'?
                                (Number(sharedvalue.quotesdata[quoteid].quotcap)%2===0?Number(sharedvalue.quotesdata[quoteid].quotcap):Number(sharedvalue.quotesdata[quoteid].quotcap)+1):sharedvalue.quotesdata[quoteid].quotcap}</Text>
                                <Text style={styles.tableheadertext1}>Capacity: {sharedvalue.quotesdata[quoteid].quotmachinetype==='ULTRA-S'?(Number(sharedvalue.quotesdata[quoteid].quotcap)%2===0?Number(sharedvalue.quotesdata[quoteid].quotcap)-2:(Number(sharedvalue.quotesdata[quoteid].quotcap)+1)-2):Number(sharedvalue.quotesdata[quoteid].quotcap)}-
                                {sharedvalue.quotesdata[quoteid].quotmachinetype==='ULTRA-S'?(Number(sharedvalue.quotesdata[quoteid].quotcap)%2===0?Number(sharedvalue.quotesdata[quoteid].quotcap):Number(sharedvalue.quotesdata[quoteid].quotcap)+1):Number(sharedvalue.quotesdata[quoteid].quotcap)+1} Ton/Hr</Text>
                                <Text style={styles.tableheadertext12}>includes: spare parts kit</Text>
                              </View>
                              <View style={styles.pricetableeachhead1}>
                                <Text style={styles.tableheadertext}>1Set</Text>
                              </View>
                              <View style={styles.pricetableeachhead3}>
                                <Text style={styles.tableheadertext}>{Number(sharedvalue.quotesdata[quoteid].quotprice)}/-</Text>
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
                                <Text style={styles.tableheadertext}>{Number(sharedvalue.quotesdata[quoteid].quotprice)}/-</Text>
                              </View>
                            </View>

                          </View>
                          <Text style={styles.numtowrords}>(<Text>Total CIF Chennai USD </Text>{text} only)</Text>

                          <View style={styles.bottomaddress}>
                            <Text style={styles.comaascoltd}>COMAAS Co.LTD</Text>
                            <Text style={styles.comaascoltdadds}>34, seongseo 5cha cheomdan-ro dalseo_gu, daegu, r.o.korea</Text>
                          </View>
                      </View>
                    </Page>

                    {/* second page desinging */}
                    <Page size='A4' style={styles.page}>
                      <View style={styles.section}>

                        <Text style={styles.logo}>COMAAS</Text>

                        <Text style={styles.quoteid}>PI No.{quoteid}</Text>

                        <View style={styles.issuedDate}>
                          <Text>Issued By J.E</Text>
                        </View>
                        
                        <Text style={styles.tableeachheading}>2. sales condition</Text>

                        <View style={styles.priceterm}>
                          <Text style={styles.pricetermhead}>price term</Text>
                          <View style={styles.pricetermlist}>
                            <View style={styles.pricetermeachlist}>
                              <Text style={styles.pricetermlistdot}>•</Text>
                              <Text style={styles.pricetermlisttext}>CIF Chennai, India</Text>
                            </View>
                            <View style={styles.pricetermeachlist}>
                              <Text style={styles.pricetermlistdot}>•</Text>
                              <Text style={styles.pricetermlisttext}>GST 18% EXTRA</Text>
                            </View>
                            <View style={styles.pricetermeachlist}>
                              <Text style={styles.pricetermlistdot}>•</Text>
                              <Text style={styles.pricetermlisttext}>Transportation from Chennai extra</Text>
                            </View>
                            <View style={styles.pricetermeachlist}>
                              <Text style={styles.pricetermlistdot}>•</Text>
                              <Text style={styles.pricetermlisttext}>Clearing expenses and any other expenses in buyer's account only</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.priceterm}>
                          <Text style={styles.pricetermhead}>payment term</Text>
                          <View style={styles.pricetermlist}>
                            <Text style={{fontFamily:'OpenSans',fontSize:10,fontWeight:400,textTransform:'capitalize'}}>
                              {sharedvalue.quotesdata[quoteid].quotpayterm}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.orderconfirmtext}>
                          Order confirmation Advance amount Rs.300000/- to be paid to <Text style={{fontFamily:'OpenSans',textDecoration:'underline',fontWeight:600,fontSize:10}}>Bank Details:</Text> 
                          <Text style={{fontFamily:'OpenSans',fontWeight:600,fontSize:10}}> sruthi technologies,</Text> HDFC Bank , Account.No.50200030537582,
                          Ifsc-HDFC0001639, tulasi Nagar, Kukatpally. Which will be after sending TT.
                        </Text>
                        
                        <Text style={styles.saleconditioninnerhead}>bank account</Text>
                        <Text style={styles.bankaccounttext1}>Advising bank: <Text style={{fontWeight:700}}>KEB HANA BANK, DAEGU </Text>419-13 611, GUKCHAEBOSANG-RO, JUNG-GU, DAEGU,SOUTH KOREA</Text>
                        <Text style={styles.bankaccounttext}><Text style={{fontWeight:700}}>Swift Code: </Text>KOEXKRSE OR KOEXKRSEXXX</Text>
                        <Text style={styles.bankaccounttext}><Text style={{fontWeight:700}}>Account No: </Text>10391001338538</Text>
                        <Text></Text>
                        <Text style={styles.saleconditioninnerhead}>delivery time</Text>
                        <Text style={styles.saleconditioninnertext}>
                          30 days after receipt of your formal order and down payment by customer
                        </Text>
                        <Text style={styles.saleconditioninnerhead}>validity</Text>
                        <Text style={styles.saleconditioninnertext}>
                          90 days from the issuing date of this PI.
                        </Text>
                        <Text style={styles.saleconditioninnerhead}>capacity</Text>
                        <Text style={styles.saleconditioninnertext}>
                          Capacity will depends on type of contamination; percentage of contamination and type of Umaterial. The capacity mentioned
                          in this quotation based on Steam {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].businesstype} upto 5-10% contamination with only India {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].businesstype}, with nill broken {sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].businesstype}
                           without  stones/foreign material. Contamination will be Counted based on <Text style={{textTransform:'uppercase',fontWeight:600}}>Count</Text> not on weight method. 
                        </Text>
                        <Text style={styles.saleconditioninnerhead}>warranty</Text>
                        <Text style={styles.saleconditioninnertext}>
                        Warranty is effective for Year from the date of commissioning by our technician in customer's Factory. In delay of commissioning
                         schedule or without commissioning, the warranty may be effective for {Number(sharedvalue.quotesdata[quoteid].quotwarranty)} Years from shipment date.
                        </Text>
                        <Text style={styles.saleconditioninnertext1}>Warranty includes the replacement of the faulty parts.</Text>
                        <Text style={styles.saleconditioninnertext}>Warranty shall not include wear and tear parts and except basic spare parts supplied freely. as well as damages caused by buyer
                           because unexpected or careless operation and maintenance of the machine and any similar reasons.</Text>
                        <View style={styles.bottomaddress}>
                          <Text style={{fontSize:10,fontFamily:'OpenSans',textTransform:'capitalize',fontWeight:600}}>For <Text style={{color:'#09A6D1'}}> COMAAS Co, LTD</Text></Text>
                          <Text style={styles.logo}>COMAAS</Text>
                          <Text style={{fontSize:10,fontFamily:'OpenSans',fontWeight:600}}>President/Kyung un Jang</Text>
                          <Text style={styles.comaascoltd}>COMAAS Co.LTD</Text>
                          <Text style={styles.comaascoltdadds}>34, seongseo 5cha cheomdan-ro dalseo-gu, daegu, r.o.korea</Text>
                        </View>
                      </View>
                    </Page>

                    {/* third page desinginig  */}
                    <Page size='A4' style={styles.page}>
                      <View style={styles.section}>
                        <Text style={styles.logo}>COMAAS</Text>

                        <Text style={styles.quoteid}>PI No.{quoteid}</Text>

                        <View style={styles.issuedDate}>
                          <Text>Issued By J.E</Text>
                        </View>

                        <Text style={styles.tableeachheading}>3. description:<Text style={{fontWeight:600,color:'#6004DA'}}> super</Text>
                        <Text style={{fontWeight:600,color:'#017BE6'}}> high</Text><Text style={{fontWeight:600,color:'green'}}> precision </Text>- 
                        <Text style={{fontWeight:600,color:'#D35400'}}>{sharedvalue.leadsdata[sharedvalue.quotesdata[quoteid].quotlead].businesstype} </Text>
                        <Text style={{fontWeight:600,color:'red'}}>color </Text><Text style={{fontWeight:600,color:'green'}}>sorter</Text></Text>

                        <View style={styles.descriptiontable}>
                          <View style={styles.destablecon}>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>SI No</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>Description</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Nominal capacity</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>{sharedvalue.quotesdata[quoteid].quotmachinetype==='ULTRA-S'?(Number(sharedvalue.quotesdata[quoteid].quotcap)%2===0?Number(sharedvalue.quotesdata[quoteid].quotcap)-2:(Number(sharedvalue.quotesdata[quoteid].quotcap)+1)-2):Number(sharedvalue.quotesdata[quoteid].quotcap)}-
                                {sharedvalue.quotesdata[quoteid].quotmachinetype==='ULTRA-S'?(Number(sharedvalue.quotesdata[quoteid].quotcap)%2===0?Number(sharedvalue.quotesdata[quoteid].quotcap):Number(sharedvalue.quotesdata[quoteid].quotcap)+1):Number(sharedvalue.quotesdata[quoteid].quotcap)+1}(T/H)*</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>N Channels/Ejectors</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>{(sharedvalue.quotesdata[quoteid].quotmachinetype==='ULTIMA'||sharedvalue.quotesdata[quoteid].quotmachinetype==='RGBS')===true?Number(sharedvalue.quotesdata[quoteid].quotcap)*64:Number(sharedvalue.quotesdata[quoteid].quotcap)*42}</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Dimension (mm) WXLXH</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>2285 x 1415 x 1702</Text>
                              </View>
                            </View>
                            
                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Power (kw)</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>4</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Compressor (HP) </Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>Aprox.25</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Language</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>Multi Language</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>CCD sensors</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>DALSA-Canada/Kodak japan</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>N of Pixels / Camera</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>2048/4096</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Accurate</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>0.14/0.07mm</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Cameras: Each chute / Total</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                {/* <Text style={styles.destablecoltxt2}>2/{Number(sharedvalue.quotesdata[quoteid].quotcap)*2}nos</Text> */}
                                <Text style={styles.destablecoltxt2}>{sharedvalue.quotesdata[quoteid].quotmachinetype==='ULTRA-S'?
                                (Number(sharedvalue.quotesdata[quoteid].quotcap)%2===0?Number(sharedvalue.quotesdata[quoteid].quotcap):Number(sharedvalue.quotesdata[quoteid].quotcap)+1):sharedvalue.quotesdata[quoteid].quotcap}</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Lenses</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>NIKON Japan</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Ejectors</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>SMC- Japan</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Shelf life</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}> {`>`} Billions shoots</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Shooting speed</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>{`>`}1200/sec</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Lamps</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>LED</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Filter</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>SMC- Japan</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Image acquisition</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>Yes</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Lamps and ejectors monitoring</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>Yes</Text>
                              </View>
                            </View>

                            <View style={styles.destablerow}>
                              <View style={styles.destablecol1}>
                                <Text style={styles.destablecoltxt1}>Ethernet connection</Text>
                              </View>
                              <View style={styles.destablecol2}>
                                <Text style={styles.destablecoltxt2}>Yes</Text>
                              </View>
                            </View>

                          </View>
                          <View style={{width:250}}>
                            <View style={styles.rgbImageView}>
                              <Image src={Rgb} style={styles.rgbimage} />
                            </View>
                          </View>
                            

                        </View>

                        <View style={styles.bottomaddress}>
                          <Text style={styles.comaascoltd}>COMAAS Co.LTD</Text>
                          <Text style={styles.comaascoltdadds}>34, seongseo 5cha cheomdan-ro dalseo_gu, daegu, r.o.korea</Text>
                        </View>

                      </View>
                    </Page>
                </Document>}
                </>
      //  </PDFViewer>
    )
};

const styles = StyleSheet.create({
    //destablecoltxt2
    destablecoltxt2:{
      fontSize:10,
      fontWeight:600,
      fontFamily:'OpenSans',

      textAlign:'center'
    },
    //destablecoltxt1
    destablecoltxt1:{
      fontSize:10,
      fontWeight:600,
      fontFamily:'OpenSans',
  
    },
    //destablecol2
    destablecol2:{
      border:'0.2px solid gray',
      width:'100%',
      padding:7,
      paddingTop:7,
      paddingBottom:7
    },
    //destablecol1
    destablecol1:{
      border:'0.2px solid gray',
      padding:7,
      width:'100%',
      paddingTop:7,
      paddingBottom:7
    },
    //destablerow
    destablerow:{
      display:'flex',
      flexDirection:'row'
    },
    //destablecon
    destablecon:{
      border:'0.5px solid gray',
      width:'100%',
      marginRight:20,
    },
    //descriptiontable
    descriptiontable:{
      // backgroundColor:'red',
      paddingLeft:20,
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      marginTop:20,
      width:'100%'
    },
    //bankaccounttext1
    bankaccounttext1:{
      marginTop:4,
      marginBottom:4,
      fontFamily:'OpenSans',
      fontSize:10,
      fontWeight:600
    },
    //bankaccounttext
    bankaccounttext:{
      
      marginBottom:4,
      fontFamily:'OpenSans',
      fontSize:10,
      fontWeight:600
    },
    //saleconditioninnertext1
    saleconditioninnertext1:{
      fontFamily:'OpenSans',
      fontSize:10,
      fontWeight:400,
      textTransform:'capitalize'
    },
    //saleconditioninnertext
    saleconditioninnertext:{
      fontFamily:'OpenSans',
      fontSize:10,
      fontWeight:400,
      marginBottom:5,
      textTransform:'capitalize'
    },
    //saleconditioninnerhead
    saleconditioninnerhead:{
      fontSize:10,
      fontWeight:600,
      fontFamily:'OpenSans',
      textDecoration:'underline',
      textTransform:'capitalize',
      marginBottom:4
    },
    //orderconfirmtext
    orderconfirmtext:{
      fontFamily:'OpenSans',
      fontSize:10,
      fontWeight:400,
      textTransform:'capitalize',
      marginTop:5,
      marginBottom:5
    },
    //pricetermlistdot
    pricetermlistdot:{
      fontSize:10
    },
    //pricetermlisttext
    pricetermlisttext:{
      flex:1,
      fontSize:10,
      fontFamily:'OpenSans',
      fontWeight:400,
    },
    //pricetermeachlist
    pricetermeachlist:{
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      gap:5,
      marginBottom:2
    },
    //pricetermlist
    pricetermlist:{
      paddingLeft:15,
    },
    //pricetermhead
    pricetermhead:{
      fontSize:10,
      fontFamily:'OpenSans',
      fontWeight:400,
      textDecoration:"underline",
      textTransform:'capitalize',
      marginBottom:4
    },
    //price term
    priceterm:{
      marginTop:5
    },
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
    marginTop:12,
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
