const anchor = require('@project-serum/anchor');
const assert = require('assert');

describe('program-derived-address', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.ProgramDerivedAddress;
  const parentKeypair = anchor.web3.Keypair.generate();

  it('Is initialized!', async () => {
    // Add your test here.
    const name = 'My name';
    const authority = program.provider.wallet.publicKey;
    const childPubkey = await program.account.child.associatedAddress(
      authority,
      parentKeypair.publicKey
    );

    await program.rpc.initialize(name, {
      accounts: {
        child: childPubkey,
        parent: parentKeypair.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        authority,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [parentKeypair],
      instructions: [
        await program.account.parent.createInstruction(
          parentKeypair
        ),
      ]
    });

    const parentAccount =
      await program.account.parent.fetch(
        parentKeypair.publicKey
      );
    const childAccount = await program.account.child.associated(
      authority,
      parentKeypair.publicKey
    );
    assert.ok(childAccount.name === name);
    assert.ok(parentAccount.authority.equals(authority));
    assert.ok(childAccount.authority.equals(authority));
    assert.ok(parentAccount.child.equals(childPubkey));
  });
});
