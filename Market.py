from pyteal import *


def approval_program():
    
    handle_creation = Return(
        Seq(
            Int(1)
        )
    )


    refunds = Seq(

        senderAssetBalance := AssetHolding.balance(Global.current_application_address(), Txn.assets[0]),
        If(
            senderAssetBalance.hasValue() == Int(0),
            Seq(
                Assert(Gtxn[1].amount() == Int(100000)),
                Assert(Gtxn[1].receiver() == Global.current_application_address()),
                InnerTxnBuilder.Begin(),
                InnerTxnBuilder.SetFields({
                    TxnField.type_enum: TxnType.AssetTransfer,
                    TxnField.xfer_asset: Txn.assets[0],
                    TxnField.asset_receiver: Global.current_application_address(),
                    TxnField.asset_amount: Int(0),
                }),
                InnerTxnBuilder.Submit()
                
            ),
            Seq(
                assetCreator := AssetParam.creator(Txn.assets[0]),
                assetUnit := AssetParam.unitName(Txn.assets[0]),
                Assert(assetCreator.value() == Addr("BS5D5I56LGDFTAVW4ZR2VOZMUYVI4RHUICX2JB2U3373WKB2RZ2HD6K2G4")),
                Assert(assetUnit.value() == Bytes("HH")),
                Assert(Gtxn[1].xfer_asset() == Txn.assets[0]),
                Assert(Gtxn[1].asset_receiver() == Global.current_application_address()),
                Assert(Gtxn[1].asset_amount() == Int(1)),                

                Assert(Txn.assets[1] == Int(1000870705)),
                InnerTxnBuilder.Begin(),
                InnerTxnBuilder.SetFields({
                    TxnField.type_enum: TxnType.AssetTransfer,
                    TxnField.xfer_asset: Txn.assets[1],
                    TxnField.asset_receiver: Txn.sender(),
                    TxnField.asset_amount: Int(10000),
                }),
                InnerTxnBuilder.Submit()
            )
        ),
        Int(1)
    )
    

    hoomens = Seq(
        nftName := AssetParam.name(Txn.assets[0]),
        Assert(Substring(nftName.value(), Int(0), Int(13)) == Bytes("Happy Hoomens")),
        Seq(
            Assert(Gtxn[0].xfer_asset() == Int(1000870705)),
            Assert(Gtxn[0].asset_receiver() == Addr("II6ZZJFPVGXVGQOMDSZ3AXZEMX3UFRTXKBCQT7L25P3ON2SWJUFXOCRW2A")),
            Assert(Gtxn[0].asset_amount() == Int(120000))
        ),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: Txn.assets[0],
            TxnField.asset_receiver: Txn.sender(),
            TxnField.asset_amount: Int(1),
        }),
        InnerTxnBuilder.Submit(),
       Int(1)

        
        
    )

   

    opt_in = Seq(
        Assert(Txn.sender() == Addr("NSPLIQLVYV7US34UDYGYPZD7QGSHWND7AWSWPD4FTLRGW5IF2P2R3IF3EQ")),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: Txn.assets[0],
            TxnField.asset_receiver: Global.current_application_address(),
            TxnField.asset_amount: Int(0),
        }),
        InnerTxnBuilder.Submit(),
        Int(1)
    )


    # doesn't need anyone to opt in
    handle_optin = Return(Int(1))

    # only the creator can closeout the contract
    handle_closeout = Return(Int(1))

    # nobody can update the contract
    handle_updateapp =  Return(Txn.sender() == Global.creator_address())

    # only creator can delete the contract
    handle_deleteapp = Return(Txn.sender() == Global.creator_address())


    # handle the types of application calls
    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        [Txn.application_args[0] == Bytes("Refunds"), Return(refunds)],
        [Txn.application_args[0] == Bytes("Hoomens"), Return(hoomens)],
        [Txn.application_args[0] == Bytes("optin"), Return(opt_in)]

   
    )
    
    return program

# let clear state happen
def clear_state_program():
    program = Return(Int(1))
    return program
    


if __name__ == "__main__":
    with open("vote_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=7)
        f.write(compiled)

    with open("vote_clear_state.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=7)
        f.write(compiled)