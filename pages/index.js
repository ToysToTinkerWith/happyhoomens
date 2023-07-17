import React, { useState } from "react"

import Head from "next/head"

import SplashScreen from "./splash"

import Nav from "../components/nav/nav"

import HappyHoomens from "../components/contracts/Market/HappyHoomens"

import { useWallet } from '@txnlab/use-wallet'


export default function Index() { 

    const { activeAccount } = useWallet()
 
        return (
            <div >
                <Head>
                <title>Happy H00mans</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="" />
                <meta name="keywords" content="" />

                
                </Head>

                <SplashScreen />

               <Nav />

               {activeAccount ? 
                <HappyHoomens activeAddress={activeAccount.address} />
                :
                <HappyHoomens />
                }

              
               
                

            </div>
        )
    
}