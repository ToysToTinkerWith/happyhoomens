import React from "react";
import Script from "next/script"
import Document, { Html, Head, Main, NextScript } from "next/document";
import theme from "../theme";

export default class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
     
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="title" content="Happy Hoomens" />
          <meta name="description" content="Happy Hoomans is an educations based blockchain project built on the Algorand chain. The project seeks to bridge the gap between web2 and web3 communities by providing incentives to learn." />
          <meta name="keywords" content="Happy Hoomans, Education, NFT, Algorand"/>

          <meta name="theme-color" content={theme.palette.primary.main} />

          
          
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />

          <link rel="icon" href="/images/favicon.ico"/>
          <link rel="shortcut icon" href="/images/favicon.ico"/>

          
          
        </Head>
        <body style={{backgroundColor: "#FFAFAA"}}>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

