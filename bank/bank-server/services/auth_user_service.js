/**
 * DNP
 * auth_user_service: Handler for authentication
 */

const auth_user_service = {
    /* Cookie Details for Security Token */
    cookie_token_name: "_bank_sess",
    cookie_token_options: {
        httpOnly: true,
        secure: true
    },
    cookie_token_expiry: '1800s',

    /* Cookie Details for User ID Cookie */
    cookie_userID_name: "bank_userid",
    cookie_token_expiry: '1800s',
}