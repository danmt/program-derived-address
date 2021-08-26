use anchor_lang::prelude::*;

#[program]
pub mod program_derived_address {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, name: String) -> ProgramResult {
        ctx.accounts.parent.authority = *ctx.accounts.authority.key;
        ctx.accounts.parent.child = *ctx.accounts.child.to_account_info().key;
        ctx.accounts.child.name = name;
        ctx.accounts.child.authority = *ctx.accounts.authority.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, associated = authority, with = parent, space = 320)]
    child: ProgramAccount<'info, Child>,
    #[account(signer)]
    authority: AccountInfo<'info>,
    #[account(init)]
    parent: ProgramAccount<'info, Parent>,
    system_program: AccountInfo<'info>,
}

#[account]
pub struct Parent {
    pub authority: Pubkey,
    pub child: Pubkey,
}

#[associated]
#[derive(Default)]
pub struct Child {
    name: String,
    authority: Pubkey,
}
