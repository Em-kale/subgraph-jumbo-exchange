import { near, log, BigInt, json, JSONValueKind } from "@graphprotocol/graph-ts"
import { DepositAndStake, LiquidUnstake, Unstake } from "../generated/schema" // ensure to add any entities you define in schema.graphql

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  
  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i], 
      receipt.receipt, 
      receipt.block.header,
      receipt.outcome,
      receipt.receipt.signerPublicKey
      )
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome,
  publicKey: near.PublicKey
): void {
  
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }
  
  const functionCall = action.toFunctionCall();

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "deposit_and_stake") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let logs = new DepositAndStake(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      logs.blockHeight = BigInt.fromU64(blockHeader.height)
      logs.blockHash = blockHeader.hash.toBase58()
      logs.predecessorId = receipt.predecessorId
      logs.receiverId = receipt.receiverId
      logs.signerId = receipt.signerId
      logs.signerPublicKey = publicKey.bytes.toBase58()
      logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      logs.tokensBurned = outcome.tokensBurnt
      logs.outcomeId = outcome.id.toBase58()
      logs.executorId = outcome.executorId
      logs.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs !=null){
          let splitString = outcome.logs[0].split(" ")
          let splitString1 = outcome.logs[1].split('"')
          let splitString2 = [""]
          let splitString3 = [""]

          logs.available_balance = BigInt.fromString(splitString[9])
          logs.accountId = splitString1[7]
          logs.amount = BigInt.fromString(splitString1[11])

          if(outcome.logs.length > 2){
            splitString2 = outcome.logs[2].split(" ")
            logs.nslp_account_stake_shares = BigInt.fromString(splitString2[4])
          }

          if(outcome.logs.length > 3){
            splitString3 = outcome.logs[3].split(" ")
            logs.nslp_clearing_shares  = BigInt.fromString(splitString3[2])
            logs.nslp_clearing_value = BigInt.fromString(splitString3[2])
          }
          else{
            logs.nslp_clearing_shares = BigInt.fromI32(0)
            logs.nslp_clearing_value = BigInt.fromI32(0)
          }
        }
    
        logs.save()
      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }
  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "liquid_unstake") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let logs = new LiquidUnstake(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      logs.blockHeight = BigInt.fromU64(blockHeader.height)
      logs.blockHash = blockHeader.hash.toBase58()
      logs.predecessorId = receipt.predecessorId
      logs.receiverId = receipt.receiverId
      logs.signerId = receipt.signerId
      logs.signerPublicKey = publicKey.bytes.toBase58()
      logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      logs.tokensBurned = outcome.tokensBurnt
      logs.outcomeId = outcome.id.toBase58()
      logs.executorId = outcome.executorId
      logs.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs !=null){
          
          let splitString = outcome.logs[0].split(":").join(" ").split(",").join(" ").split(" ")
          let splitString1 = outcome.logs[1].split("=").join(" ").split(" ")
          let splitString2 = outcome.logs[2].split(":").join(" ").split(" ")
          let splitString3 = outcome.logs[3].split(" ")
          let splitString4 = outcome.logs[4].split(" ")
          let splitString5 = outcome.logs[5].split('"')
          
          
          logs.st_near_owned = BigInt.fromString(splitString[2])
          logs.to_sell = BigInt.fromString(splitString[5])
          logs.available_near = BigInt.fromString(splitString1[2])
          logs.max_near_to_pay = BigInt.fromString(splitString1[5])
          logs.treasury_st_near_cut = BigInt.fromString(splitString2[1])
          logs.operator_st_near_cut = BigInt.fromString(splitString2[3])
          logs.developers_st_near_cut = BigInt.fromString(splitString2[5])
          logs.fee_in_st_near = BigInt.fromString(splitString2[7])
          logs.nslp_add_st_near = BigInt.fromString(splitString3[1])
          logs.st_liquid_unstaked = BigInt.fromString(splitString4[2]) 
          logs.near_got = BigInt.fromString(splitString4[5])
          logs.meta_got = BigInt.fromString(splitString4[8]) 
          logs.accountId = splitString5[7]
     
        logs.save()
      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }}
   // change the methodName here to the methodName emitting the log in the contract
   if (functionCall.methodName == "unstake") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let logs = new Unstake(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      logs.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      logs.blockHeight = BigInt.fromU64(blockHeader.height)
      logs.blockHash = blockHeader.hash.toBase58()
      logs.predecessorId = receipt.predecessorId
      logs.receiverId = receipt.receiverId
      logs.signerId = receipt.signerId
      logs.signerPublicKey = publicKey.bytes.toBase58()
      logs.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      logs.tokensBurned = outcome.tokensBurnt
      logs.outcomeId = outcome.id.toBase58()
      logs.executorId = outcome.executorId
      logs.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs !=null){
        let splitString = outcome.logs[0].split('"')
        let splitString1 = outcome.logs[1].split(":").join(" ").split(" ")

        logs.accountId = splitString[7]
        logs.amount = BigInt.fromString(splitString[11])
        logs.shares = BigInt.fromString(splitString[15])
        logs.total_unstaked = BigInt.fromString(splitString1[5])
        logs.st_near = BigInt.fromString(splitString1[8])
        logs.epoch = BigInt.fromString(splitString1[11])
     
        logs.save()
      
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }
}}