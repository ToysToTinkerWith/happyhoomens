from pyteal import *


def approval_program():
    
    handle_creation = Return(
        Seq(
            Int(1)
        )
    )

    i = ScratchVar(TealType.uint64) 


    assetCreator = AssetParam.creator(Txn.assets[i.load()])
    assetUnitName = AssetParam.unitName(Txn.assets[i.load()])
    assetHolding = AssetHolding.balance(Txn.sender(), Txn.assets[i.load()])

    evolve = Seq(
        Assert(Txn.assets.length() == Int(6)),
        For(i.store(Int(0)), i.load() < Txn.assets.length() - Int(1), i.store(i.load() + Int(1))).Do(Seq(
            Assert(Gtxn[i.load()].xfer_asset() == Txn.assets[i.load()]),
            assetCreator,
            Assert(assetCreator.value() == Addr("BS5D5I56LGDFTAVW4ZR2VOZMUYVI4RHUICX2JB2U3373WKB2RZ2HD6K2G4")),
            assetUnitName,
            Assert(Substring(assetUnitName.value(), Int(0), Int(2)) == Bytes("HH")),
            assetHolding,
            Assert(assetHolding.hasValue()),
        )),
        cerbCreator := AssetParam.creator(Txn.assets[5]),
        Assert(cerbCreator.value() == Addr("IWBP3D5T2AXEUBWAVBDIIIAIZVOSM3AYXGNNJEJEOEHUDLLDBOXVAYBATI")),
        cerbUnitName := AssetParam.unitName(Txn.assets[5]),
        Assert(Substring(cerbUnitName.value(), Int(0), Int(5)) == Bytes("HHCer")),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: Txn.assets[5],
            TxnField.asset_receiver: Txn.sender(),
            TxnField.asset_amount: Int(1),
        }),
        InnerTxnBuilder.Submit(),
       Int(1)
    )

    opt_in = Seq(
        For(i.store(Int(0)), i.load() < Txn.assets.length(), i.store(i.load() + Int(1))).Do(Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: Txn.assets[i.load()],
                TxnField.asset_receiver: Global.current_application_address(),
                TxnField.asset_amount: Int(0),
            }),
            InnerTxnBuilder.Submit()
         )),
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
        [Txn.application_args[0] == Bytes("Evolve"), Return(evolve)],
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