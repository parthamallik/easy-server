module.exports = {
    'service': {
        'INCORRECT_SCHEMA': {
            'code':400,
            'message': 'Object not in accordance with the schema'
        },
        'SCHEMA_NOT_FOUND': {
            'code':500,
            'message': 'Schema not found'
        },
        'INTERNAL_SERVER_ERROR': {
            'code': 500,
            'message': 'Internal server error'
        },
        'USER_NOT_FOUND': {
            'code':400,
            'message': 'User not found'
        },
        'INCORRECT_PASSWORD': {
            'code': 401,
            'message': 'message:Incorrect password'
        },
        'NOT_FOUND' {
            'code': 404,
            'message': 'Not found'
        }
    },
    'local': {
        'EMAIL_ALREAY_REGISTERED': {
            'code': 409,
            'message': 'Email address already registered'
        },
        'SKETCH_TITLE_ALREADY_EXIST': {
            'code': 409,
            'message': 'Sketch with the same title already exists'
        },
        'INTERNAL_SERVER_ERROR': {
            'code': 500,
            'message': 'Internal server error'
        },
        'RECORD_NOT_FOUND': {
            'code': 404,
            'message': 'Record not found'
        },
        'UNAUTHORIZED' : {
            'code': 401,
            'message': 'Unauthorized access'
        },
        'INVALID_SKETCH_ID' : {
            'code': 400,
            'message': 'Invalid sketch Id'
        },
       'SCHEMA_NAME_ALREADY_EXIST' : {
            'code': 409,
            'message': 'Schema with the same name already exists'
        },
        'SCHEMA_ALREADY_EXISTS' : {
            'code': 409,
            'message': 'Schema already exists'
        },
        'INVALID_FORMAT' : {
            'code': 400,
            'message': 'Invalid format'
        },
        'INVALID_SCHEMA_ID' : {
            'code': 400,
            'message': 'Invalid schema Id'
        },
        'INVALID_PROPERTY_ID' : {
            'code': 400,
            'message': 'Invalid property Id'
        },
        'INVALID_SCHEMA_TYPE' : {
            'code': 400,
            'message': 'Invalid schema type'
        },
        'INVALID_API_ID' : {
            'code': 400,
            'message': 'Invalid API Id'
        },
        'INVALID_API_PARAMETER_ID' : {
            'code': 400,
            'message': 'Invalid API parameter Id'
        },
        'INVALID_API_PAYLOAD_ID' : {
            'code': 400,
            'message': 'Invalid API payload Id'
        },
        'INVALID_PAYLOAD_TYPE' : {
            'code': 400,
            'message': 'Invalid input value for payload type'
        },
        'INVALID_PARAMETER_TYPE' : {
            'code': 400,
            'message': 'Invalid input value for parameter type'
        },
        'INVALID_API_PAYLOAD_CONTENT_ID' : {
            'code': 400,
            'message': 'Invalid API payload content Id'
        },
        'INVALID_API_RESPONSE_HEADER_ID' : {
            'code': 400,
            'message': 'Invalid API response header Id'
        },
        'SCHEMA_HAS_DEPENDENCY' : {
            'code': 400,
            'message': 'Schema has dependency and cannot be deleted'
        }
    }

};
