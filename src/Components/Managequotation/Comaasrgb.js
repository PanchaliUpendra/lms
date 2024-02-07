import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
// import { PDFViewer } from '@react-pdf/renderer';
const Comaasrgb = ({quoteid}) => {
    return(
        // <PDFViewer style={styles.container}>
                <Document>
                    <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.logo}>COMAAS</Text>
                        <Text style={styles.quoteid}>PI No.{quoteid}</Text>
                        <Text>This is a dynamically generated PDF page.</Text>
                    </View>
                    </Page>
                    <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text>Hello, World!</Text>
                        <Text>This is a dynamically generated PDF page.</Text>
                    </View>
                    </Page>
                    <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text>Hello, World!</Text>
                        <Text>This is a dynamically generated PDF page.</Text>
                    </View>
                    </Page>
                </Document>
        // </PDFViewer>
    )
};

const styles = StyleSheet.create({
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
    borderColor:'black'
  },
  logo:{
    fontSize:14,
    fontWeight:'bolder',
    color:'blue',
  },
  quoteid:{
    textAlign:'center',
    fontSize:12,
  }
});

export default  Comaasrgb;
