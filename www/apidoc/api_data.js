define({ "api": [
  {
    "type": "get",
    "url": "/api/v1/test/:userid",
    "title": "get api",
    "name": "api_get",
    "group": "sample",
    "version": "1.0.2",
    "permission": [
      {
        "name": "ALL"
      }
    ],
    "description": "<p>the api description  ver 2 :  parameters change</p>",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{userid : johnDoe@gmail.com}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{json-array}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc/api_document_descriptor.js",
    "groupTitle": "sample",
    "sampleRequest": [
      {
        "url": "https://api.mysite.com/api/v1/test/:userid"
      }
    ]
  },
  {
    "type": "get",
    "url": "/api/v1/test",
    "title": "get api",
    "name": "api_get",
    "group": "sample",
    "version": "1.0.0",
    "permission": [
      {
        "name": "ALL"
      }
    ],
    "description": "<p>the api description ver 1</p>",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{param1 : 1 , param2 : 2 }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{json-array}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc/api_document_descriptor.js",
    "groupTitle": "sample",
    "sampleRequest": [
      {
        "url": "https://api.mysite.com/api/v1/test"
      }
    ]
  },
  {
    "type": "post",
    "url": "/api/v2/post",
    "title": "post api",
    "name": "api_post",
    "group": "sample",
    "version": "1.0.0",
    "permission": [
      {
        "name": "ALL"
      }
    ],
    "description": "<p>post api description</p>",
    "header": {
      "fields": {
        "MyHeaderGroup": [
          {
            "group": "MyHeaderGroup",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value.</p>"
          },
          {
            "group": "MyHeaderGroup",
            "type": "String",
            "optional": false,
            "field": "access-key",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{param1 : 1 , param2 : 2 }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Lastname of the User.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"firstname\": \"John\",\n  \"lastname\": \"Doe\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc/api_document_descriptor.js",
    "groupTitle": "sample",
    "sampleRequest": [
      {
        "url": "https://api.mysite.com/api/v2/post"
      }
    ]
  },
  {
    "type": "post",
    "url": "/api/v2/post",
    "title": "post api",
    "name": "api_post",
    "group": "test",
    "version": "1.0.0",
    "permission": [
      {
        "name": "ALL"
      }
    ],
    "description": "<p>post api description</p>",
    "header": {
      "fields": {
        "MyHeaderGroup": [
          {
            "group": "MyHeaderGroup",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value.</p>"
          },
          {
            "group": "MyHeaderGroup",
            "type": "String",
            "optional": false,
            "field": "access-key",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{param1 : 1 , param2 : 2 }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Lastname of the User.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"firstname\": \"John\",\n  \"lastname\": \"Doe\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id of the User was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "apidoc/api_document_descriptor.js",
    "groupTitle": "test",
    "sampleRequest": [
      {
        "url": "https://api.mysite.com/api/v2/post"
      }
    ]
  }
] });
