import { BN } from 'bn.js';
import { parse, serialize, Prefix, ContractTxData, OP_CREATECONTRACT, MethodParameter, OP_CALLCONTRACT, deserializeMethodParam, deserializeString, parseString, LONG_MAXVALUE, UINT_MAXVALUE, INT_MAXVALUE, ULONG_MAXVALUE, UINT128_MAXVALUE, UINT256_MAXVALUE, QrCodePayload } from '../src';
import { Address } from 'bitcore-lib-cirrus';

describe('deserialize', () => {

  it('should have the correct data for a call 2', () => {

    let scData = {
      to: "tSE2mpV4vBi7tiLUUAhyLNN8FooD3bYrag",
      method: "Approve",
      amount: "0",
      parameters: [
        {
          label: "Address",
          value: "9#tWBY7T75kB8jfwACbWX7jLjapSe7gPou6z"
        },
        {
          label: "Current Amount",
          value: "7#0"
        },
        {
          label: "Amount",
          value: "7#1"
        }
      ],
      callback: "http://test.example.com"
    } as QrCodePayload;

    let contractTxData = {
      vmVersion: 1,
      opCodeType: OP_CALLCONTRACT, // TODO change this if CREATEs are possible
      contractAddress: new Address(scData.to),
      gasPrice: new BN(100), // TODO gas values need to be adjusted
      gasLimit: new BN(250000),
      methodName: scData.method,
      methodParameters: scData.parameters.map(p => deserializeString(p.value))
    } as ContractTxData;

    let result = serialize(contractTxData).toUpperCase();

    // Verified from FN
    expect(result).toEqual("C101000000640000000000000090D0030000000000D3B619AE6691693B0EE605721CF76B0F746307CDF487417070726F7665ABEA9509FF1DD89963303B0DFBA7516C47D82F6D145A716D8907000000000000000089070100000000000000");
  });

  it('should have the correct data for a call', () => {
    // vmversion 1, gasprice 1, gaslimit 18446744073709551615, method name
    let oo = "c1";
    let vmversion = "0100";
    let gasprice = "0100000000000000"; // Use the full-width gasprice to ensure BNs are comparable
    let gasLimit = "ffffffffffffffff";
    let contractAddress = "6400000000000000000000000000000000000000";
    let method = "c9874578656375746580";
    let hex = "c1010000000100000000000000ffffffffffffffff6400000000000000000000000000000000000000c9874578656375746580";
    let txData = parse(hex)
    let opcode = 193;

    expect(txData.vmVersion).toEqual(1)
    expect(txData.opCodeType).toEqual(opcode);
    expect(txData.gasPrice).toEqual(new BN(gasprice, "hex", "le"));
    expect(txData.gasLimit).toEqual(new BN(gasLimit, "hex", "le"));
    expect(txData.contractAddress).toEqual(new Address(Buffer.from(contractAddress, "hex")));
    expect(txData.methodName).toEqual("Execute");
  });

  it('should have the correct method params', () => {
    // vmversion 1, gasprice 1, gaslimit 18446744073709551615, method name
    /*
        {
            object[] methodParameters =
            {
                true,
                (byte)1,
                Encoding.UTF8.GetBytes("test"),
                's',
                "test",
                (int)int.MaxValue,
                (uint)uint.MaxValue,
                (long)long.MaxValue,
                (ulong)ulong.MaxValue,
                UInt128.MaxValue,
                UInt256.MaxValue,
                "0x95D34980095380851902ccd9A1Fb4C813C2cb639".HexToAddress() // "tLaoqrq1hrMtrpt45895b1sA7WhoDfCpHZ" on CirrusTest or "CW86N7KVQzV9tv5UebAXabvGoaCQqH4oor" on CirrusMain
            };
    */
    let gasLimit = "ffffffffffffffff";
    let contractAddress = "6400000000000000000000000000000000000000";
    let hex = "c1010000000100000000000000ffffffffffffffff6400000000000000000000000000000000000000f88c8745786563757465b882f880820101820201850a74657374830373008504746573748506ffffff7f8505ffffffff8908ffffffffffffff7f8907ffffffffffffffff910bffffffffffffffffffffffffffffffffa10cffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff950995d34980095380851902ccd9a1fb4c813c2cb639";
    let txData = parse(hex)
    let opcode = 193;

    expect(txData.opCodeType).toEqual(opcode);
    expect(txData.gasPrice.toBuffer("le", 8)).toEqual(new BN(1).toBuffer("le", 8));
    expect(txData.gasLimit).toEqual(new BN(gasLimit, "hex", "le"));
    expect(txData.contractAddress).toEqual(new Address(Buffer.from(contractAddress, "hex")));
    expect(txData.methodName).toEqual("Execute");
    expect(txData.methodParameters[0].type).toEqual(Prefix.Bool);
    expect(txData.methodParameters[0].value).toEqual(true);
    expect(txData.methodParameters[1].type).toEqual(Prefix.Byte);
    expect(txData.methodParameters[1].value).toEqual(Buffer.from([1]));
    expect(txData.methodParameters[2].type).toEqual(Prefix.ByteArray);
    expect(txData.methodParameters[2].value).toEqual(Buffer.from("test", "utf8"));
    expect(txData.methodParameters[3].type).toEqual(Prefix.Char);
    expect(txData.methodParameters[3].value).toEqual("s");
    expect(txData.methodParameters[4].type).toEqual(Prefix.String);
    expect(txData.methodParameters[4].value).toEqual("test");
    expect(txData.methodParameters[5].type).toEqual(Prefix.Int);
    expect(txData.methodParameters[5].value).toEqual(2147483647);
    expect(txData.methodParameters[6].type).toEqual(Prefix.UInt);
    expect(txData.methodParameters[6].value).toEqual(4294967295);
    expect(txData.methodParameters[7].type).toEqual(Prefix.Long);
    expect(txData.methodParameters[7].value).toEqual(new BN("FFFFFFFFFFFFFF7F", "hex", "le")); // long.MaxValue
    expect(txData.methodParameters[8].type).toEqual(Prefix.ULong);
    expect(txData.methodParameters[8].value).toEqual(new BN("FFFFFFFFFFFFFFFF", "hex", "le")); // ulong.MaxValue
    expect(txData.methodParameters[9].type).toEqual(Prefix.UInt128);
    expect(txData.methodParameters[9].value).toEqual(new BN("ffffffffffffffffffffffffffffffff", "hex", "le")); // UInt128.MaxValue
    expect(txData.methodParameters[10].type).toEqual(Prefix.UInt256);
    expect(txData.methodParameters[10].value).toEqual(new BN("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "hex", "le")); // UInt256.MaxValue
    expect(txData.methodParameters[11].type).toEqual(Prefix.Address);
    expect(txData.methodParameters[11].value).toEqual(new Address("CW86N7KVQzV9tv5UebAXabvGoaCQqH4oor"));
  });  
});

describe('serialize', () => {

  it('should have the correct data when serializing a call', () => {
    // vmversion 1, gasprice 1, gaslimit 18446744073709551615, method name
    /*
        {
            object[] methodParameters =
            {
                true,
                (byte)1,
                Encoding.UTF8.GetBytes("test"),
                's',
                "test",
                (int)int.MaxValue,
                (uint)uint.MaxValue,
                (long)long.MaxValue,
                (ulong)ulong.MaxValue,
                UInt128.MaxValue,
                UInt256.MaxValue,
                "0x95D34980095380851902ccd9A1Fb4C813C2cb639".HexToAddress() // "CW86N7KVQzV9tv5UebAXabvGoaCQqH4oor" CirrusMain
            };
    */
   
    let gasLimit = "ffffffffffffffff";

    let contractTxData = {
      opCodeType: OP_CALLCONTRACT,
      vmVersion: 1,
      contractAddress: new Address(Buffer.from("6400000000000000000000000000000000000000", "hex")),
      gasPrice: new BN("0100000000000000", "hex", "le"),
      gasLimit: new BN(gasLimit, "hex", "le"),
      methodName: "Execute",
      methodParameters: [
        {
          type: Prefix.Bool,
          value: true
        },
        {
          type: Prefix.Byte,
          value: Buffer.from([1])
        },
        {
          type: Prefix.ByteArray,
          value: Buffer.from("test", "utf8")
        },
        {
          type: Prefix.Char,
          value: "s"
        },
        {
          type: Prefix.String,
          value: "test"
        },
        {
          type: Prefix.Int,
          value: 2147483647
        },
        {
          type: Prefix.UInt,
          value: 4294967295
        },
        {
          type: Prefix.Long,
          value: new BN("FFFFFFFFFFFFFF7F", "hex", "le")
        },
        {
          type: Prefix.ULong,
          value: new BN("FFFFFFFFFFFFFFFF", "hex", "le")
        },
        {
          type: Prefix.UInt128,
          value: new BN("ffffffffffffffffffffffffffffffff", "hex", "le")
        },
        {
          type: Prefix.UInt256,
          value: new BN("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "hex", "le")
        },
        {
          type: Prefix.Address,
          value: new Address("CW86N7KVQzV9tv5UebAXabvGoaCQqH4oor")
        }
      ]
    } as ContractTxData;

    let hex = serialize(contractTxData);
    
    let expectedHex = "c1010000000100000000000000ffffffffffffffff6400000000000000000000000000000000000000f88c8745786563757465b882f880820101820201850a74657374830373008504746573748506ffffff7f8505ffffffff8908ffffffffffffff7f8907ffffffffffffffff910bffffffffffffffffffffffffffffffffa10cffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff950995d34980095380851902ccd9a1fb4c813c2cb639";
    
    // Verified in FullNode
    expect(hex).toEqual(expectedHex);
  });

  it('should roundtrip hex correctly', () => {
    let hex = "c1010000000100000000000000ffffffffffffffff6400000000000000000000000000000000000000f88c8745786563757465b882f880820101820201850a74657374830373008504746573748506ffffff7f8505ffffffff8908ffffffffffffff7f8907ffffffffffffffff910bffffffffffffffffffffffffffffffffa10cffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff950995d34980095380851902ccd9a1fb4c813c2cb639";

    expect(hex).toEqual(serialize(parse(hex)));
  });

  it('should roundtrip objects correctly', () => {

    expect(new Address("CW86N7KVQzV9tv5UebAXabvGoaCQqH4oor").toStratisBuffer()).toEqual(Buffer.from("95D34980095380851902ccd9A1Fb4C813C2cb639", "hex"));
    
    let contractTxData = {
      opCodeType: OP_CALLCONTRACT,
      vmVersion: 1,
      contractAddress: new Address(Buffer.from("6400000000000000000000000000000000000000", "hex")),
      gasPrice: new BN("0100000000000000", "hex", "le"),
      gasLimit: new BN("ffffffffffffffff", "hex", "le"),
      methodName: "Execute",
      methodParameters: [
        {
          type: Prefix.Bool,
          value: true
        },
        {
          type: Prefix.Byte,
          value: Buffer.from([1])
        },
        {
          type: Prefix.ByteArray,
          value: Buffer.from("test", "utf8")
        },
        {
          type: Prefix.Char,
          value: "s"
        },
        {
          type: Prefix.String,
          value: "test"
        },
        {
          type: Prefix.Int,
          value: 2147483647
        },
        {
          type: Prefix.UInt,
          value: 4294967295
        },
        {
          type: Prefix.Long,
          value: new BN("FFFFFFFFFFFFFF7F", "hex", "le")
        },
        {
          type: Prefix.ULong,
          value: new BN("FFFFFFFFFFFFFFFF", "hex", "le")
        },
        {
          type: Prefix.UInt128,
          value: new BN("ffffffffffffffffffffffffffffffff", "hex", "le")
        },
        {
          type: Prefix.UInt256,
          value: new BN("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "hex", "le")
        },
        {
          type: Prefix.Address,
          value: new Address(Buffer.from("95D34980095380851902ccd9A1Fb4C813C2cb639", "hex"))
          //value: new Address("CW86N7KVQzV9tv5UebAXabvGoaCQqH4oor")
        }
      ]
    } as ContractTxData;

    expect(contractTxData).toEqual(parse(serialize(contractTxData)));
  });
});

describe('deserialize strings', () => {
  it('should parse a string param', () => {
    let stringData = "4#Test";

    let param = parseString(stringData);

    expect(param).toEqual({
      prefix: "4",
      value: "Test"
    });
  });

  it('parse a string param with a hash and a prefix > 9', () => {
    let stringData = "10#Te#st";

    let param = parseString(stringData);

    expect(param).toEqual({
      prefix: "10",
      value: "Te#st"
    });
  });

  it('should deserialize a false bool param to a methodparam', () => {
    let prefix = Prefix.Bool;
    let value = "False"; 
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: false
    } as MethodParameter);
  });

  it('should deserialize a true bool param to a methodparam', () => {
    let prefix = Prefix.Bool;
    let value = "True"; 
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: true
    } as MethodParameter);
  });

  it('should deserialize an int param to a methodparam', () => {
    let prefix = Prefix.Int;
    let value = INT_MAXVALUE; // int.MaxValue
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: +value
    } as MethodParameter);
  });

  it('should not deserialize a number larger than int', () => {
    let prefix = Prefix.Int;
    let value = INT_MAXVALUE + 1; // int.MaxValue + 1
    let stringData = `${prefix}#${value}`;

    expect(() => deserializeString(stringData)).toThrow();
  });


  it('should deserialize a uint param to a methodparam', () => {
    let prefix = Prefix.UInt;
    let value = UINT_MAXVALUE; // uint.MaxValue
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: +value
    } as MethodParameter);
  });

  it('should not deserialize a number larger than uint', () => {
    let prefix = Prefix.UInt;
    let value = UINT_MAXVALUE + 1; // uint.MaxValue + 1
    let stringData = `${prefix}#${value}`;

    expect(() => deserializeString(stringData)).toThrow();
  });

  it('should deserialize a long param to a methodparam', () => {
    let prefix = Prefix.Long;
    let value = LONG_MAXVALUE; // int.MaxValue
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: value
    } as MethodParameter);
  });

  it('should not deserialize a number larger than long', () => {
    let prefix = Prefix.Long;
    let value = LONG_MAXVALUE.add(new BN(1)); // long.MaxValue + 1
    let stringData = `${prefix}#${value}`;

    expect(() => deserializeString(stringData)).toThrow();
  });

  it('should deserialize a ulong param to a methodparam', () => {
    let prefix = Prefix.ULong;
    let value = ULONG_MAXVALUE; // int.MaxValue
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: value
    } as MethodParameter);
  });

  it('should not deserialize a number larger than ulong', () => {
    let prefix = Prefix.ULong;
    let value = ULONG_MAXVALUE.add(new BN(1)); // ulong.MaxValue + 1
    let stringData = `${prefix}#${value}`;

    expect(() => deserializeString(stringData)).toThrow();
  });

  it('should deserialize a uint128 param to a methodparam', () => {
    let prefix = Prefix.UInt128;
    let value = UINT128_MAXVALUE; // int.MaxValue
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: value
    } as MethodParameter);
  });

  it('should not deserialize a number larger than uint128', () => {
    let prefix = Prefix.UInt128;
    let value = UINT128_MAXVALUE.add(new BN(1)); // uint128.MaxValue + 1
    let stringData = `${prefix}#${value}`;

    expect(() => deserializeString(stringData)).toThrow();
  });

  it('should deserialize a uint256 param to a methodparam', () => {
    let prefix = Prefix.UInt256;
    let value = UINT256_MAXVALUE; // int.MaxValue
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: value
    } as MethodParameter);
  });

  it('should not deserialize a number larger than uint256', () => {
    let prefix = Prefix.UInt256;
    let value = UINT256_MAXVALUE.add(new BN(1)); // uint256.MaxValue + 1
    let stringData = `${prefix}#${value}`;

    expect(() => deserializeString(stringData)).toThrow();
  });


  it('should deserialize a string param to a methodparam', () => {
    let prefix = Prefix.String;
    let value = "Te#st";
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: value
    } as MethodParameter);
  });

  it('should deserialize a char param to a methodparam', () => {
    let prefix = Prefix.Char;
    let value = "#st";
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: value
    } as MethodParameter);
  });

  it('should deserialize a byte param to a methodparam', () => {
    let prefix = Prefix.Byte;
    let value = "FA";
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: Buffer.from([0xFA])
    } as MethodParameter);
  });

  it('should deserialize a byte array param to a methodparam', () => {
    let prefix = Prefix.ByteArray;
    let value = "AABBCCDD";
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: Buffer.from([0xAA, 0xBB, 0xCC, 0xDD])
    } as MethodParameter);
  });

  it('should deserialize an address to a methodparam', () => {
    let prefix = Prefix.Address;
    let value = "CW86N7KVQzV9tv5UebAXabvGoaCQqH4oor";
    let stringData = `${prefix}#${value}`;

    let methodParam = deserializeString(stringData);

    expect(methodParam).toEqual({
      type: prefix,
      value: new Address(value)
    } as MethodParameter);
  });
});