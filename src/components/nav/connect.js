import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet'

import { Button, Typography, Grid, Popover } from '@mui/material';

export default function Connect(props) {
  const { providers, activeAccount } = useWallet()

  const [anchor, setAnchor] = useState(null)

    const handleClick = (event) => {
        setAnchor(event.currentTarget);
      };

    const handleClose = () => {
        setAnchor(null);
    };

    const open = Boolean(anchor);


  // Map through the providers.
  // Render account information and "connect", "set active", and "disconnect" buttons.
  // Finally, map through the `accounts` property to render a dropdown for each connected account.
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: 0, height: "100%"}}>


      <Button
        style={{
          height: 60, width: 200
        }}
        variant="outlined"
        onClick={handleClick} 
        >
          {activeAccount ?
          <Typography style={{
            fontSize: "1.38em"
          }}> Connected </Typography>
          :
          <Typography style={{
            fontSize: "1.38em"
          }}> Connect Wallet </Typography>
          }
      </Button>

      <Popover
        id={"popover1"}
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
   
      {providers?.map((provider) => (
        <div key={'provider-' + provider.metadata.id} style={{margin: 30}}>
          <h4>
            <img width={30} height={30} alt="" src={provider.metadata.icon} />
            {provider.metadata.name} {provider.isActive && '[active]'}
          </h4>
          <div>
            <button onClick={provider.connect} disabled={provider.isConnected}>
              Connect
            </button>
            <button onClick={provider.disconnect} disabled={!provider.isConnected}>
              Disconnect
            </button>
            <button
              onClick={provider.setActiveProvider}
              disabled={!provider.isConnected || provider.isActive}
            >
              Set Active
            </button>
            <div>
              {provider.isActive && provider.accounts.length && (
                <select
                  value={activeAccount?.address}
                  onChange={(e) => provider.setActiveAccount(e.target.value)}
                >
                  {provider.accounts.map((account) => (
                    <option key={account.address} value={account.address}>
                      {account.address}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      ))}
     </Popover>
      
          
    </div>
  )
}