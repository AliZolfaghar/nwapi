/**
 * @api {get} /api/v1/test get api 
 * @apiName api_get
 * @apiGroup sample
 * @apiVersion 1.0.0
 * @apiPermission ALL
 * 
 * @apiDescription 
 * the api description ver 1 
 * 
 * @apiParamExample {json} Request-Example:
 * {param1 : 1 , param2 : 2 }
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {json-array}
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 * 
 */


 /**
 * @api {get} /api/v1/test/:userid get api
 * @apiName api_get
 * @apiGroup sample
 * @apiVersion 1.0.2
 * @apiPermission ALL
 * 
 * @apiDescription 
 * the api description  ver 2 :  parameters change 
 * 
 * @apiParamExample {json} Request-Example:
 * {userid : johnDoe@gmail.com}
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {json-array}
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 * 
 */


 /**
 * @api {post} /api/v2/post post api 
 * @apiName api_post
 * @apiGroup sample
 * @apiVersion 1.0.0
 * @apiPermission ALL
 * 
 * @apiDescription 
 * post api description 
 * 
 * @apiHeader (MyHeaderGroup) {String} authorization Authorization value.
 * @apiHeader (MyHeaderGroup) {String} access-key Users unique access-key.
 * 
 * @apiParam {Number} id Users unique ID.
 * 
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 * 
 * @apiParamExample {json} Request-Example:
 * {param1 : 1 , param2 : 2 }
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */


 
 /**
 * @api {post} /api/v2/post post api 
 * @apiName api_post
 * @apiGroup test
 * @apiVersion 1.0.0
 * @apiPermission ALL
 * 
 * @apiDescription 
 * post api description 
 * 
 * @apiHeader (MyHeaderGroup) {String} authorization Authorization value.
 * @apiHeader (MyHeaderGroup) {String} access-key Users unique access-key.
 * 
 * @apiParam {Number} id Users unique ID.
 * 
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 * 
 * @apiParamExample {json} Request-Example:
 * {param1 : 1 , param2 : 2 }
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

