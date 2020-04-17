module.exports = {
    'newUser' : {
        'required': [
            'firstname',
            'lastname',
            'email',
            'password'
        ],
        'properties': {
            'firstname': {
                'type': 'string'
            },
            'lastname': {
                'type': 'string'
            },
            'email': {
                'type': 'string',
                'format': 'email'
            },
            'password': {
                'type': 'string',
                'format' : 'password'
            }
        }
    },

    'loginUser' : {
        'required': [
            'email',
            'password'
        ],
        'properties': {
            'email': {
                'type': 'string',
                'format': 'email'
            },
            'password': {
                'type': 'string',
                'format' : 'password'
            }
        }
    },

    'newPet' : {
        'required': [
            'name',
            'color',
            'type',
            'quantity'
        ],
        'properties': {
            'name': {
                'type': 'string',
            },
            'color': {
                'type': 'string',
            },
            'type': {
                'type': 'string',
            },
            'quantity': {
                'type': 'integer',
            }
        }
    },

    'updatePet' : {
        'required': [],
        'properties': {
            'name': {
                'type': 'string',
            },
            'color': {
                'type': 'string',
            },
            'type': {
                'type': 'string',
            },
            'quantity': {
                'type': 'integer',
            }
        }
    }
}
