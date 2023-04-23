import React from 'react'

import { Grid, Typography } from "@mui/material"

import Connect from "./connect"

export default function Nav(props) {

  // Map through the providers.
  // Render account information and "connect", "set active", and "disconnect" buttons.
  // Finally, map through the `accounts` property to render a dropdown for each connected account.
  return (
    <div style={{backgroundColor: "#AAAFFF"}}>
        <Grid container>
            <Grid item xs={12} sm={6}>
                <img src={"./hooman.jpg"} style={{width: "20%", minWidth: 50, marginTop: "5%", marginBottom: "5%", marginRight: 20, marginLeft: 30, maxWidth: 100, borderRadius: 15}} />
                <Typography variant="h5" style={{position: "relative", display: "inline", bottom: 20}}> Happy Humans</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Connect />
            </Grid>

        </Grid>
    </div>
  )
}