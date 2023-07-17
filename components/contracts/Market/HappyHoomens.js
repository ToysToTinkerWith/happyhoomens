import React from "react"

import algosdk from "algosdk"

import { Grid, Typography, Button } from "@mui/material"

import BuyHoomen from "./BuyHoomen"
import RefundHoomen from "./RefundHoomen"
import EvolveHoomen from "./EvolveHoomen"



export default class HappyHoomens extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            contract: 1083909143,
            allHoomens: [],
            allCerb: [],
            conHoomens: [],
            ownedHoomens: [],
            ownedCerb: [],
            evolveNfts: [],
            cat: "",
            zoomNft: null,
            confirm: ""
        };
    }

    componentDidMount() {
        
     

        (async () => {

          const token = {
            'X-API-Key': process.env.indexerKey
          }
         
          const indexerClient = new algosdk.Indexer(token, 'https://mainnet-algorand.api.purestake.io/idx2', '')

          let address = await algosdk.getApplicationAddress(this.state.contract)

          let assets = await indexerClient.lookupAccountAssets(address).do();

          let numHoomen = 0

          let numAssets
          let nextToken

          
          assets.assets.forEach(async (asset) => {
            if(asset.amount == 1) {
              if (numHoomen < 12) {
                this.setState(prevState => ({
                  conHoomens: [...prevState.conHoomens, {id: asset["asset-id"]}]
                }))
                numHoomen += 1
              }

              
            }
            
          })

          numAssets = assets.assets.length
          nextToken = assets["next-token"]

          while (numAssets == 1000) {

            assets = await indexerClient.lookupAccountAssets(address).nextToken(nextToken).do();

            assets.assets.forEach(async (asset) => {
                if(asset.amount == 1) {
                      if (numHoomen < 12) {
                        this.setState(prevState => ({
                          conHoomens: [...prevState.conHoomens, {id: asset["asset-id"]}]
                        }))
                        numHoomen += 1
                      }
                      
                    } 
            })

            numAssets = assets.assets.length
            nextToken = assets["next-token"]

          }
            

            if (this.props.activeAddress) {

              let assetsHoomens = await indexerClient.lookupAccountCreatedAssets("BS5D5I56LGDFTAVW4ZR2VOZMUYVI4RHUICX2JB2U3373WKB2RZ2HD6K2G4")
            .limit(1000).do();
  
            assetsHoomens.assets.forEach(async (asset) => {
              if(asset.params["unit-name"].substring(0, 2) == "HH") {
                this.setState(prevState => ({
                  allHoomens: [...prevState.allHoomens, asset.index]
                }))
              }
              
            })
  
            let assetsLen = assetsHoomens.assets.length
            let assetsNext = assetsHoomens["next-token"]
  
            while (assetsLen == 1000) {
  
              assetsHoomens = await indexerClient.lookupAccountCreatedAssets("AL6F3TFPSZPF3BSVUFDNOLMEKUCJJAA7GZ5GF3DN3Q4IVJVNUFK76PQFNE").nextToken(assetsNext)
                .limit(1000).do();
  
                assetsHoomens.assets.forEach(async (asset) => {
                if(asset.params["unit-name"].substring(0, 4) == "HH") {
                    this.setState(prevState => ({
                      allHoomens: [...prevState.allHoomens, asset.index]
                    }))
                  }
                
              })
  
              assetsLen = assetsHoomens.assets.length
              assetsNext = assetsHoomens["next-token"]
  
            }

            let assetsCerb = await indexerClient.lookupAccountAssets("7CT4OC5JECBCD2HB3PXF4Q7CAVPACDIJCVJQX6CDQ2IK7OQWINVG5FKH7E")
            .limit(1000).do();
  
            assetsCerb.assets.forEach(async (asset) => {
              if(asset.amount > 0) {
                this.setState(prevState => ({
                  allCerb: [...prevState.allCerb, asset["asset-id"]]
                }))
              }
              
            })

              let assetsWallet = await indexerClient.lookupAccountAssets(this.props.activeAddress)
              .limit(1000).do();

    
              assetsWallet.assets.forEach(async (asset) => {
                if(this.state.allHoomens.includes(asset["asset-id"]) && asset.amount == 1) {
                  this.setState(prevState => ({
                    ownedHoomens: [...prevState.ownedHoomens, asset["asset-id"]]
                  }))
                }
                if(this.state.allCerb.includes(asset["asset-id"]) && asset.amount == 1) {
                  this.setState(prevState => ({
                    ownedCerb: [...prevState.ownedCerb, asset["asset-id"]]
                  }))
                }
                
              })
    
              assetsLen = assetsWallet.assets.length
              assetsNext = assetsWallet["next-token"]
    
              while (assetsLen == 1000) {
    
                assetsWallet = await indexerClient.lookupAccountAssets(this.props.activeAddress).nextToken(assetsNext)
                  .limit(1000).do();
    
                  assetsWallet.assets.forEach(async (asset) => {
                    if(this.state.allHoomens.includes(asset["asset-id"]) && asset.amount == 1) {
                      this.setState(prevState => ({
                        ownedHoomens: [...prevState.ownedHoomens, asset["asset-id"]]
                      }))
                    }
                    if(this.state.allCerb.includes(asset["asset-id"]) && asset.amount == 1) {
                      this.setState(prevState => ({
                        ownedCerb: [...prevState.ownedCerb, asset["asset-id"]]
                      }))
                    }
                    
                  })
    
                assetsLen = assetsWallet.assets.length
                assetsNext = assetsWallet["next-token"]


              }

            }

        


        })().catch(e => {
            console.error(e);
            console.trace();
        })

      }

      removeElement(nftId) {
        let index = this.state.evolveNfts.indexOf(nftId)
        let newArray = this.state.evolveNfts
        newArray.splice(index, 1)
        this.setState({
          evolveNfts: newArray
        })

      }

    render() {
    
        return (
            <div >
              <br />
                <>
                  <Grid container align="center" spacing={3} >
                      <Grid item xs={12} sm={12} md={4} lg={4} >
                          <Button style={{border: "1px solid black", backgroundColor: this.state.cat == "Hoomens" ? "#FEC0FF" : null, borderRadius: 4, padding: 10, height: 60, width: 200}} onClick={() => this.state.cat == "Hoomens" ? this.setState({cat: "", zoomNft: null, confirm: ""}) : this.setState({cat: "Hoomens", zoomNft: null, confirm: ""})}>
                            <Typography  variant="h6" style={{color: "#000000"}}> Pups1 </Typography>
                          </Button>
                          
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4} >
                          <Button style={{border: "1px solid black", backgroundColor: this.state.cat == "Refunds" ? "#FEC0FF" : null, borderRadius: 4, padding: 10, height: 60, width: 200}} onClick={() => this.state.cat == "Refunds" ? this.setState({cat: "", zoomNft: null, confirm: ""}) : this.setState({cat: "Refunds", zoomNft: null, confirm: ""})}>
                            <Typography  variant="h6" style={{color: "#000000"}}> Refunds </Typography>
                          </Button>
                          
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4} >
                          <Button style={{border: "1px solid black", backgroundColor: this.state.cat == "Evolve" ? "#FEC0FF" : null, borderRadius: 4, padding: 10, height: 60, width: 200}} onClick={() => this.state.cat == "Evolve" ? this.setState({cat: "", zoomNft: null, confirm: ""}) : this.setState({cat: "Evolve", zoomNft: null, confirm: ""})}>
                            <Typography  variant="h6" style={{color: "#000000"}}> Evolve </Typography>
                          </Button>
                          
                      </Grid>
                    </Grid>

                    {this.state.cat == "Hoomens" ? 
                      <>
                      <br />
                        <Typography color="secondary" align="center" variant="h6" style={{display: "flex", margin: "auto", position: "relative", justifyContent: "center"}}> 
                        
                        <img style={{width: 50, paddingRight: 20}} src="images/Treats.svg"/>
                        -
                        {(12000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
 
                        </Typography>
                        <br />
                        

                      </>
                      :
                      null
                    }

                    {this.state.cat == "Refunds" ? 
                      <>
                      <br />
                        <Typography color="secondary" align="center" variant="h6" style={{display: "flex", margin: "auto", position: "relative", justifyContent: "center"}}> 
                        
                        <img style={{width: 50, paddingRight: 20}} src="images/Treats.svg"/>
                        +
                        {(1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
 
                        </Typography>
                        <br />
                        

                      </>
                      :
                      null
                    }

                      {this.state.cat == "Evolve" ? 
                      <>
                      <br />
                        <Typography color="secondary" align="center" variant="h6" style={{display: "flex", margin: "auto", position: "relative", justifyContent: "center"}}> 
                        {this.state.evolveNfts.length > 4 ? "Evolve" : "Select 5 Pups1 to evolve"}
                        
 
                        </Typography>
                        <br />
                        

                      </>
                      :
                      null
                    }
                    
                    

                    {this.state.confirm ? 
                      <>
                      <Typography color="secondary" align="center" variant="h6"> {this.state.confirm} </Typography>
                      </>
                      :
                      null
                    }

                    <Grid container spacing={3} >

                    {this.state.cat == "Hoomens" ?

                    this.state.zoomNft ? 
                    <Grid item xs={12} sm={12} md={12} lg={12} >
                        <BuyHoomen contract={this.state.contract} nftId={this.state.zoomNft} activeAddress={this.props.activeAddress} wallet={this.props.wallet} setNft={(nftId) => this.setState({zoomNft: nftId})} zoom={true} cat={this.state.cat} />
                    </Grid>
                    :

                    this.state.conHoomens.map((nft, index) => {
                        return (
                            <Grid key={index} item xs={6} sm={4} md={3} lg={2} style={{position: "relative"}} >
                                <BuyHoomen contract={this.state.contract} style={{position: "absolute"}} nftId={nft.id} activeAddress={this.props.activeAddress} wallet={this.props.wallet} setNft={(nftId) => this.setState({zoomNft: nftId})}/>
                                
                            </Grid>
                        )
                    })

                    :
                    null
                    }

                    {this.state.cat == "Refunds" ?

                    this.state.zoomNft ? 
                    <Grid item xs={12} sm={12} md={12} lg={12} >
                        <RefundHoomen contract={this.state.contract} nftId={this.state.zoomNft} activeAddress={this.props.activeAddress} wallet={this.props.wallet} setNft={(nftId) => this.setState({zoomNft: nftId})} zoom={true} cat={this.state.cat} />
                    </Grid>
                    :

                    this.state.ownedHoomens.map((nft, index) => {
                        return (
                            <Grid key={index} item xs={6} sm={4} md={3} lg={2} style={{position: "relative"}} >
                                <RefundHoomen contract={this.state.contract} style={{position: "absolute"}} nftId={nft} activeAddress={this.props.activeAddress} wallet={this.props.wallet} setNft={(nftId) => this.setState({zoomNft: nftId})}/>
                                
                            </Grid>
                        )
                    })

                    :
                    null
                    }

                    {this.state.cat == "Evolve" && this.state.evolveNfts.length > 4 ?
                         this.state.zoomNft ? 
                         <Grid item xs={12} sm={12} md={12} lg={12} >
                             <EvolveHoomen contract={this.state.contract} evolveNfts={this.state.evolveNfts} nftId={this.state.zoomNft} activeAddress={this.props.activeAddress} wallet={this.props.wallet} setNft={(nftId) => this.setState({zoomNft: nftId})} zoom={true} cat={this.state.cat} />
                         </Grid>
                         :
                         this.state.allCerb.map((nft, index) => {
                          return (
                              <Grid key={index} item xs={12} sm={6} md={6} lg={3} style={{position: "relative"}} >
                                  <EvolveHoomen contract={this.state.contract} style={{position: "absolute"}} evolveNfts={this.state.evolveNfts} nftId={nft} activeAddress={this.props.activeAddress} wallet={this.props.wallet} setNft={(nftId) => this.setState({zoomNft: nftId})}/>
                                  
                              </Grid>
                          )
                      })
                      :
                      null
                    }

                    {this.state.cat == "Evolve" ?
                    this.state.ownedHoomens.map((nft, index) => {
                        return (
                            <Grid key={index} item xs={6} sm={4} md={3} lg={2} style={{position: "relative"}} >
                                <EvolveHoomen contract={this.state.contract} style={{position: "absolute"}} evolveNfts={this.state.evolveNfts} nftId={nft} activeAddress={this.props.activeAddress} wallet={this.props.wallet} addNft={(nftId) => this.setState(prevState => ({evolveNfts: [...prevState.evolveNfts, nftId]}))} removeNft={(nftId) => this.removeElement(nftId)}/>
                                
                            </Grid>
                        )
                    })

                    :
                    null
                    }

                    

                   
                    
                    </Grid>

                    <br />

  

                  
                  
                  

                  

                </>
                

                

             
                
                
            </div>
        )
    }
    
}