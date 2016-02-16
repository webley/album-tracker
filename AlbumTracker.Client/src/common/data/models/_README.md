# Models

Here is the home for model definitions (MD for short).



## Model definition

To define a model you need to call `dalProvider.defineModel` in config section.

`defineModel` method have 2 arguments:

  * Model definition name. String, upper CamelCase.
  * Config object

For example:
``` javascript
dalProvider.defineModel('FooModel',
    {
        fields: {
            foo: {
                type: dalProvider.fieldTypes.INTEGER
            },
            bar: {
                type: dalProvider.fieldTypes.STRING
            }
        }
    }
);
```


## Config object

Config object is... Well, it is an object. And it can contains such sections:

  * `extend` - for inheritance
  * `fields` - for field definitions
  * `validate` - for model validators
  * `methods` - for custom methods



## Model inheritance

Model definitions can be inherited. Like classes in C#. But MD can have two or more "parents".

`extend` is an optional field, array of strings. You can set up here names of parent's model definitions.
Properties from parents will be inherited in that order of in which parents were declared in array.



## Field definitions

`fields` is an Object with configs of field definitions:

  * key - field name (String)
  * value - field definition config (Object)


### Field Definition Config

Field definition config can contains such sections:

#### `name` (String, optional).

Name of the field. Will be used in client-side object. The key from Field Definition Config is used by default.

#### `serverName` (String, optional).

Name of the field in server-side object. `name` field is used by default.

#### `type` (String, optional).

Use values from dalProvider.fieldTypes object for that field. Type can be:

 * DYNAMIC - type will be detected automatically. Used by default.
 * OBJECT - plain JS object.
 * ARRAY
 * FLOAT
 * INTEGER
 * STRING
 * BOOLEAN
 * DATE

#### `defaultValue` (optional).

Default value for field. Used for new model creating from client-side.

#### `get` (method, optional)

This method is used for custom fields calculation. It will be executed to calculate field's value of client side object from server-side object.
Method can return plain value, object or promise. This value will become field of client-side model.
Arguments of method:
  * this: Current RepresentationModel
  * argument 1: Server-side object
  * argument 2: Field definition
  * argument 3: $injector angular service

#### `set` (method, optional)

This method is used for custom fields saving. It will be executed to save field's value of client side object to server-side object.
Arguments of method:
  * this: Current RepresentationModel
  * argument 1: Server-side object
  * argument 2: Field definition
  * argument 3: $injector angular service

#### `validators` (Array, optional)

Validators - is an Array with series of groups of validation method and validation messages. These groups can be wrapped as Arrays.

Validation method must return true to pass the validation, otherwise validation will fail. If method will return string - this string will be used as validation message.

Validation messages is used as `sprintf` arguments, where the first argument is a string with `%s` placeholders. Validation messages will be translated automatically.

Examples:
``` javascript
//...
count: {
    type: RepresentationModelFieldTypes.INTEGER,
    validate: [
        function (val) {
            return val && val >= 0;
        },
        "Field value must be positive"
    ]
}
//...
```

``` javascript
//...
fieldName: {
    type: RepresentationModelFieldTypes.INTEGER,
    validate: [
        function (val) {
            if (!val) {
                return "Field value can't be undefined";
            }
            if (val < 0) {
                return "Field value must be positive";
            }
            return true; // validation is passed
        }
    ]
}
//...
```

``` javascript
//...
count: {
    type: RepresentationModelFieldTypes.INTEGER,
    validate: [
        function (val) {
            return _.isUndefined(val);
        },
        "Field value must be defined",

        function (val) {
            return !_.isNumber(val);
        },
        "Field value is not a Number",

        function (val) {
            return val >= 0 && val <= 100;
        },
        "Field value must be between %s and %s", // sprintf pattern for translation
        "0", "100" // arguments for sprintf
    ]
}
//...
```
