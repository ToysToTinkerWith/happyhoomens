import React, {useState, useEffect} from "react"

import algosdk from "algosdk"

import { Typography, Button } from "@mui/material"

import { CID } from 'multiformats/cid'


import * as mfsha2 from 'multiformats/hashes/sha2'
import * as digest from 'multiformats/hashes/digest'

import { useWallet } from '@txnlab/use-wallet'





export default function EvolveHoomen(props) { 

  const [ contract ] = useState(1150172335)

  const [ nft, setNft ] = useState(null)
  const [ nftUrl, setNftUrl ] = useState(null)
  const [ zoomNft, setZoomNft ] = useState(null)
  const [ confirm, setConfirm ] = useState("")

  const { activeAddress, signTransactions, sendTransactions } = useWallet()

    useEffect(() => {

      const fetchData = async () => {



          let response = await fetch('/api/getNft', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nftId: props.nftId
              }),
            
                
            });
        
        let session = await response.json()


          if (session.assets[0].params["unit-name"].substring(0,5) == "HHCer") {

            setNft(session.assets[0].params)
              setNftUrl("https://ipfs.io/ipfs/" + session.assets[0].params.url.substring(7, 66))
          }

          else {

            const addr = algosdk.decodeAddress(session.assets[0].params.reserve)

          const mhdigest = digest.create(mfsha2.sha256.code, addr.publicKey)

          const cid = CID.create(1, 0x55, mhdigest)    

            await fetch("https://ipfs.io/ipfs/" + cid.toString())
            .then(async (response) => {
              let hoomenData = await response.json()
              let ipfs = hoomenData.image.substring(7)

              setNft(session.assets[0].params)
              setNftUrl("https://ipfs.io/ipfs/" + ipfs)

             
            })

          }


          

          }
          fetchData();
        
          
        }, [])

      const Evolve = async () => {

       

        const token = {
          'X-API-Key': process.env.indexerKey
        }

        const client = new algosdk.Algodv2(token, 'https://mainnet-algorand.api.purestake.io/ps2', '')

       
          const indexerClient = new algosdk.Indexer(token, 'https://mainnet-algorand.api.purestake.io/idx2', '')

        let params = await client.getTransactionParams().do();

        let optedin = false
        let optedCount = 0



        let opted = await indexerClient.lookupAccountAssets("7CT4OC5JECBCD2HB3PXF4Q7CAVPACDIJCVJQX6CDQ2IK7OQWINVG5FKH7E").do();
        opted.assets.forEach((asset) => {
          props.evolveNfts.forEach((nft) => {
            if (nft == asset["asset-id"]) {
              optedCount += 1
            }
          })
        })

        if (optedCount == 5) {
          optedin = true
        }

        if (optedin) {
          

          try {
             

  
            let txn1 = algosdk.makeAssetTransferTxnWithSuggestedParams(
                  props.activeAddress, 
                  "7CT4OC5JECBCD2HB3PXF4Q7CAVPACDIJCVJQX6CDQ2IK7OQWINVG5FKH7E", 
                  undefined, 
                  undefined,
                  1,  
                  undefined, 
                  props.evolveNfts[0], 
                  params
                );

                let txn2 = algosdk.makeAssetTransferTxnWithSuggestedParams(
                  props.activeAddress, 
                  "7CT4OC5JECBCD2HB3PXF4Q7CAVPACDIJCVJQX6CDQ2IK7OQWINVG5FKH7E", 
                  undefined, 
                  undefined,
                  1,  
                  undefined, 
                  props.evolveNfts[1], 
                  params
                );

                let txn3 = algosdk.makeAssetTransferTxnWithSuggestedParams(
                  props.activeAddress, 
                  "7CT4OC5JECBCD2HB3PXF4Q7CAVPACDIJCVJQX6CDQ2IK7OQWINVG5FKH7E", 
                  undefined, 
                  undefined,
                  1,  
                  undefined, 
                  props.evolveNfts[2], 
                  params
                );

                let txn4 = algosdk.makeAssetTransferTxnWithSuggestedParams(
                  props.activeAddress, 
                  "7CT4OC5JECBCD2HB3PXF4Q7CAVPACDIJCVJQX6CDQ2IK7OQWINVG5FKH7E", 
                  undefined, 
                  undefined,
                  1,  
                  undefined, 
                  props.evolveNfts[3], 
                  params
                );

                let txn5 = algosdk.makeAssetTransferTxnWithSuggestedParams(
                  props.activeAddress, 
                  "7CT4OC5JECBCD2HB3PXF4Q7CAVPACDIJCVJQX6CDQ2IK7OQWINVG5FKH7E", 
                  undefined, 
                  undefined,
                  1,  
                  undefined, 
                  props.evolveNfts[4], 
                  params
                );

                let txn6 = algosdk.makeAssetTransferTxnWithSuggestedParams(
                  props.activeAddress, 
                  props.activeAddress, 
                  undefined, 
                  undefined,
                  0,  
                  undefined, 
                  props.nftId, 
                  params
                );

            
                
            
  
              const appArgs = []
            appArgs.push(
              new Uint8Array(Buffer.from("Evolve"))
            )
  
            const accounts = []
            const foreignApps = undefined
              
            const foreignAssets = [...props.evolveNfts, props.nftId]
            
            let atxn = algosdk.makeApplicationNoOpTxn(props.activeAddress, params, contract, appArgs, accounts, foreignApps, foreignAssets);
            
            let txns = [txn1, txn2, txn3, txn4, txn5, txn6, atxn]
  
            let txgroup = algosdk.assignGroupID(txns)
  
          
            setConfirm("Accept evolve signature...")
  
            const encodedTransaction1 = algosdk.encodeUnsignedTransaction(txn1)

            const encodedTransaction2 = algosdk.encodeUnsignedTransaction(txn2)

            const encodedTransaction3 = algosdk.encodeUnsignedTransaction(txn3)

            const encodedTransaction4 = algosdk.encodeUnsignedTransaction(txn4)

            const encodedTransaction5 = algosdk.encodeUnsignedTransaction(txn5)

            const encodedTransaction6 = algosdk.encodeUnsignedTransaction(txn6)

            const encodedTransaction7 = algosdk.encodeUnsignedTransaction(atxn)
  
  
            const signedTransactions = await signTransactions([encodedTransaction1, encodedTransaction2, encodedTransaction3, encodedTransaction4, encodedTransaction5, encodedTransaction6, encodedTransaction7])
              
            const { id } = await sendTransactions(signedTransactions)
  
            setConfirm("Sending Transaction...")
  
            let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);
  
            setConfirm("Transaction Confirmed, Assets Successfully Evolved")
          }

          catch (error) {
            console.log(error)
            setConfirm("Transaction Rejected")
          }



          }


        else {

          try {
            const appArgs = []
            appArgs.push(
              new Uint8Array(Buffer.from("optin"))
            )
  
            const accounts = []
            const foreignApps = []
              
            const foreignAssets = props.evolveNfts
            
            let otxn = algosdk.makeApplicationNoOpTxn(props.activeAddress, params, contract, appArgs, accounts, foreignApps, foreignAssets);
           
            setConfirm("Opt in contract to pups...")
  
            const encodedTransaction = algosdk.encodeUnsignedTransaction(otxn)
  
            const signedTransactions = await signTransactions([encodedTransaction])
              
            const { id } = await sendTransactions(signedTransactions)
  
            setConfirm("Sending Transaction...")
  
            let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);
  
            setConfirm("Transaction Confirmed, Assets Opted In")
          }

          catch (error) {
            console.log(error)
            setConfirm("Transaction Rejected")
          }

        }

      
      }

   



        if (props.zoom && nft && nftUrl) {
            return (
                
              <div>
                  <Button style={{display: "flex", margin: "auto"}} onClick={() => props.setNft(null)}>
                    <img style={{width: "100%", maxWidth: 500, borderRadius: 15, border: "3px solid black"}} src={nftUrl} />
                  </Button>
                  <br />
                  <Typography color="secondary" align="center" variant="h4"> {nft.name} </Typography>
                  <br />
                  {confirm ? 
                    <>
                    
                    <Typography color="secondary" align="center" variant="h6"> {confirm} </Typography>
                    <br />
                    </>
                    :
                    null
                  }
                  {props.activeAddress ?
                  <>
                 
                  <Button variant="outlined" color="secondary" style={{display: "flex", margin: "auto"}} onClick={() => Evolve()}>
                    <Typography style={{padding: 20}} variant="h6"> Evolve </Typography>
                    <img src="images/Treats.svg" style={{display: "flex", margin: "auto", width: 50, padding: 10}} />
                  </Button>
                  </>
                  :
                  <>
                  <br />
                  <Button onClick={() => window.scrollTo(0, 0)} style={{display: "flex", margin: "auto"}}>
                      <Typography style={{color: "#FFFFFF"}}  variant="h6"> Connect Wallet </Typography>
                  </Button>
                  <br />
                  </>
                  
                  }
                

              </div>
                
               
            )
                
                
        }

        else if (nft) {
          if (nft["unit-name"] == "HH") {
            return (
       
              <Button  onClick={() => props.evolveNfts.includes(props.nftId) ? props.removeNft(props.nftId) : props.addNft(props.nftId)} style={{backgroundColor: props.evolveNfts.includes(props.nftId) ? "#FDFDFD" : null}}>
                  <Typography style={{position: "absolute", top: -15}} align="left" variant="caption"> {nft.name} </Typography>
                  <img style={{width: "100%", border: "3px solid black", borderRadius: 15}} src={nftUrl} />
              </Button>
          

            )
          }
          else if (nft["unit-name"].substring(0,5) == "HHCer")
            return (
       
                    <Button  onClick={() => props.setNft(props.nftId)} style={{backgroundColor: props.evolveNfts.includes(props.nftId) ? "#FDFDFD" : null}}>
                        <Typography style={{position: "absolute", top: -15}} align="left" variant="caption"> {nft.name} </Typography>
                        <img style={{width: "100%", border: "3px solid black", borderRadius: 15}} src={nftUrl} />
                    </Button>
                
    
            )
            
        }

        else {
            return (
                <div>                   
                </div>
    
            )
        }

    
}