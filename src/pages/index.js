import React, { useState } from "react"

import Head from "next/head"

import { Grid, Typography, Button } from "@mui/material"

import Nav from "../components/nav/nav"

import HappyHoomens from "../components/contracts/Market/HappyHoomens"

import { useWallet } from '@txnlab/use-wallet'

import algosdk from "algosdk"

export default function Index() { 

    const { activeAccount } = useWallet()

    console.log(activeAccount)
 
        return (
            <div >
                <Head>
                <title>Happy H00mans</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="" />
                <meta name="keywords" content="" />

                
                </Head>

               <Nav />

               {activeAccount ? 
                <HappyHoomens activeAddress={activeAccount.address} />
                :
                null
                }

              
               
                

            </div>
        )
    
}