import React, {useEffect, useState } from "react"

import algosdk from "algosdk"

import MyAlgo from '@randlabs/myalgo-connect';


import { useWallet } from '@txnlab/use-wallet'
import { Card, Typography, Button } from "@mui/material"

import { CID } from 'multiformats/cid'

import * as mfsha2 from 'multiformats/hashes/sha2'
import * as digest from 'multiformats/hashes/digest'


export default function RefundHoomen(props) {
  

  const [ nft, setNft ] = useState(null)
  const [ nftUrl, setNftUrl ] = useState(null)
  const [ zoomNft, setZoomNft ] = useState(null)
  const [ hoomens, setHoomens ] = useState([])
  const [ loading, setLoading ] = useState("")
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
          fetchData();
        
          
      }, [])

      let Refund = async () => {

        let client = new algosdk.Algodv2("", "https://node.algoexplorerapi.io/", "")

        const indexerClient = new algosdk.Indexer('', 'https://algoindexer.algoexplorerapi.io', '');

        let params = await client.getTransactionParams().do();

        let optedin = false

        let opted = await indexerClient.lookupAssetBalances(props.nftId).do();
        opted.balances.forEach((account) => {
          if(account.address == "VYJ2DAFRWQXBMYKZWKJXLDLM2NUGZV6C4T2NLOLVFUIACA6XBGWOZM5UKE") {
            optedin = true
          }
        })

        if (optedin) {

          let htxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            props.activeAddress, 
            "VYJ2DAFRWQXBMYKZWKJXLDLM2NUGZV6C4T2NLOLVFUIACA6XBGWOZM5UKE", 
            undefined, 
            undefined,
            1,  
            undefined, 
            props.nftId, 
            params
          );

          const appArgs = []
          appArgs.push(
            new Uint8Array(Buffer.from(this.props.cat))
          )

          const accounts = []
          const foreignApps = undefined
            
          const foreignAssets = [props.nftId, 1000870705]

          let atxn = algosdk.makeApplicationNoOpTxn(this.props.activeAddress, params, this.props.contract, appArgs, accounts, foreignApps, foreignAssets);

          let txns = [atxn, htxn]

          let txgroup = algosdk.assignGroupID(txns)

          setConfirm("Accept Refund Signature...")

          const encodedTransaction1 = algosdk.encodeUnsignedTransaction(atxn)

          const encodedTransaction2 = algosdk.encodeUnsignedTransaction(htxn)

          const signedTransactions = await signTransactions([encodedTransaction1, encodedTransaction2])
            
          const { id } = await sendTransactions(signedTransactions)

          setConfirm("Sending Transaction...")

          let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);

          setConfirm("Transaction Confirmed, Asset Successfully Refunded")

        }

        else {


          let ftxn = algosdk.makePaymentTxnWithSuggestedParams(
            props.activeAddress, 
            "VYJ2DAFRWQXBMYKZWKJXLDLM2NUGZV6C4T2NLOLVFUIACA6XBGWOZM5UKE", 
            100000, 
            undefined,
            undefined,
            params
          );

          const appArgs = []
          appArgs.push(
            new Uint8Array(Buffer.from(props.cat))

          )

          const accounts = []
          const foreignApps = undefined
            
          const foreignAssets = [props.nftId]

          let atxn = algosdk.makeApplicationNoOpTxn(props.activeAddress, params, props.contract, appArgs, accounts, foreignApps, foreignAssets);

          let txns = [atxn, ftxn]

          let txgroup = algosdk.assignGroupID(txns)

          setConfirm("Accept Opt In Signature...")

          const encodedTransaction1 = algosdk.encodeUnsignedTransaction(atxn)

          const encodedTransaction2 = algosdk.encodeUnsignedTransaction(ftxn)

          const signedTransactions = await signTransactions([encodedTransaction1, encodedTransaction2])
            
          const { id } = await sendTransactions(signedTransactions)

          setConfirm("Sending Transaction...")

          let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);

          setConfirm("Transaction Confirmed, Contract Opted In.")


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
                  <Button variant="outlined" color="secondary" style={{display: "flex", margin: "auto"}} onClick={() => Refund()}>
                    <Typography  variant="h6"> Refund 8,400 </Typography>
                    <img src="images/Treats.svg" style={{display: "flex", margin: "auto", width: 50, padding: 10}} />
                  </Button>
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
                        <img style={{width: "100%"}} src={nftUrl} />
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
    
