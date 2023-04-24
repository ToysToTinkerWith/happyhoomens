import React, {useState, useEffect} from "react"

import algosdk from "algosdk"

import MyAlgo from '@randlabs/myalgo-connect';


import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

import { Card, Typography, Button } from "@mui/material"

import { CID } from 'multiformats/cid'


import * as mfsha2 from 'multiformats/hashes/sha2'
import * as digest from 'multiformats/hashes/digest'

import { useWallet } from '@txnlab/use-wallet'





export default function BuyHoomen(props) { 

  const [ nft, setNft ] = useState(null)
  const [ nftUrl, setNftUrl ] = useState(null)
  const [ zoomNft, setZoomNft ] = useState(null)
  const [ confirm, setConfirm ] = useState("")

  const { activeAddress, signTransactions, sendTransactions } = useWallet()

  console.log(activeAddress)

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

        console.log(session)

          // let hoomenIPFS = ""

          // hoomensIPFS.forEach((hoomen) => {
          //   console.log(hoomen)
          //   if (hoomen[0] == props.nftId) {
          //     hoomenIPFS = hoomen[1]
          //   }
          // })

          //let addr = algosdk.decodeAddress(session.assets[0].params.reserve)

          const addr = algosdk.decodeAddress(session.assets[0].params.reserve)

          const mhdigest = digest.create(mfsha2.sha256.code, addr.publicKey)

          const cid = CID.create(1, 0x55, mhdigest)    

            await fetch("https://ipfs.io/ipfs/" + cid.toString())
            .then(async (response) => {
              let hoomenData = await response.json()
              console.log(hoomenData)
              let ipfs = hoomenData.image.substring(7)

              setNft(session.assets[0].params)
              setNftUrl("https://ipfs.io/ipfs/" + ipfs)

             
            })

          }
          fetchData();
        
          
        }, [])

      const BuyNft = async (payAsset) => {

        let client = new algosdk.Algodv2("", "https://node.algoexplorerapi.io/", "")

        const indexerClient = new algosdk.Indexer('', 'https://algoindexer.algoexplorerapi.io', '');

        let params = await client.getTransactionParams().do();

        let optedin = false

        let opted = await indexerClient.lookupAssetBalances(props.nftId).do();
        opted.balances.forEach((account) => {
          if(account.address == props.activeAddress) {
            optedin = true
          }
        })

        if (optedin) {

          let txn1

          if (props.cat == "Hoomens"){

              txn1 = algosdk.makeAssetTransferTxnWithSuggestedParams(
                props.activeAddress, 
                "II6ZZJFPVGXVGQOMDSZ3AXZEMX3UFRTXKBCQT7L25P3ON2SWJUFXOCRW2A", 
                undefined, 
                undefined,
                120000,  
                undefined, 
                1000870705, 
                params
              );
              
            }     

            const appArgs = []
          appArgs.push(
            new Uint8Array(Buffer.from(props.cat))
          )

          const accounts = []
          const foreignApps = undefined
            
          const foreignAssets = [props.nftId]
          
          let atxn = algosdk.makeApplicationNoOpTxn(props.activeAddress, params, props.contract, appArgs, accounts, foreignApps, foreignAssets);
          
          let txns = [txn1, atxn]

          let txgroup = algosdk.assignGroupID(txns)

        
          setConfirm("Accept payment signature...")

          const encodedTransaction1 = algosdk.encodeUnsignedTransaction(txn1)

          const encodedTransaction2 = algosdk.encodeUnsignedTransaction(atxn)


          const signedTransactions = await signTransactions([encodedTransaction1, encodedTransaction2])
            
          const { id } = await sendTransactions(signedTransactions)

          setConfirm("Sending Transaction...")

          let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);

          setConfirm("Transaction Confirmed, Asset Opted In")



          }


        else {

          let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            props.activeAddress, 
            props.activeAddress, 
            undefined, 
            undefined,
            0,  
            undefined, 
            props.nftId, 
            params
          );
         
          setConfirm("Accept opt in transaction...")

          const encodedTransaction = algosdk.encodeUnsignedTransaction(txn)

          const signedTransactions = await signTransactions([encodedTransaction])
            
          const { id } = await sendTransactions(signedTransactions)

          setConfirm("Sending Transaction...")

          let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);

          setConfirm("Transaction Confirmed, Asset Opted In")

        }

      
      }

   



        if (props.zoom && nft && nftUrl) {
            return (
                
              <Card style={{backgroundColor: "black"}}>
                  <Button style={{display: "flex", margin: "auto"}} onClick={() => props.setNft(null)}>
                    <img style={{width: "100%", maxWidth: 500}} src={nftUrl} />
                  </Button>
                  <br />
                  <Typography color="secondary" align="center" variant="h4"> {nft.name} </Typography>
                  <br />
                  {props.activeAddress ?
                  <>
                  <Button variant="contained" color="secondary" style={{display: "flex", margin: "auto"}} onClick={() => BuyNft("DC")}>
                    <Typography  variant="h6"> Buy 175,000 </Typography>
                    <img src="images/invDC.svg" style={{display: "flex", margin: "auto", width: 50, padding: 10}} />
                  </Button>
                  <br />
                  <Typography align="center" color="secondary" variant="subtitle1"> or </Typography>
                  <br />
                  <Button variant="outlined" color="secondary" style={{display: "flex", margin: "auto"}} onClick={() => BuyNft("TRTS")}>
                    <Typography  variant="h6"> Buy 12,000 </Typography>
                    <img src="images/Treats.svg" style={{display: "flex", margin: "auto", width: 50, padding: 10}} />
                  </Button>
                  </>
                  :
                  <Button onClick={() => window.scrollTo(0, 0)}>
                      <Typography  variant="h6"> Connect Wallet </Typography>
                  </Button>
                  }
                 
                  {confirm ? 
                    <>
                    <br />
                    <Typography color="secondary" align="center" variant="h6"> {confirm} </Typography>
                    

                    </>
                    :
                    null
                  }

              </Card>
                
               
            )
                
                
        }

        else if (nft) {
            return (
       
                    <Button  onClick={() => props.setNft(props.nftId)} >
                        <Typography style={{position: "absolute", top: 10, left: 10}} align="left" variant="caption"> {nft.name} </Typography>
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