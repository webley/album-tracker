// This service is used for evaluating the strength of a password
// To be updated by calculating the entropy of a string and multiply the score.
// To be upadated, support multiple alphabets
// The problem is for pattern repetitions in the password.
angular.module('psteam.common.services.password', [])
    .service('passwordEvaluatorService', function ($q, logger) {
        logger.trace('passwordEvaluatorService');
        this.evaluatePassword = function (password) {
            logger.trace('passwordEvaluatorService.evaluatePassword(password = ...)');

            var deferred = $q.defer();
            //initialiase the password check meter
            var tempStrength = 0;

            // Regular expressions for our checkPasswordStrengthMethod. We use the g flag.
            var lowerLetters = /[a-z]/g;
            var upperLetters = /[A-Z]/g;
            var numbers = /[0-9]/g;
            var symbols = /[#+@&*=;#+£.,><|}$-/:-?{-~!"^_`\[\]]/g;

            //first of all make sure the character is at least 8 characters long
            if (password.length > 7) {

                //initilaise counters
                var uletters = 0;
                var lletters = 0;
                var nnumbers = 0;
                var ssymbols = 0;

                //Check how many lower letters exist

                while (lowerLetters.exec(password) !== null) {
                    tempStrength += 1;
                    ++lletters;
                    //$log.info("lletters"+lletters);
                }

                //Check how many upper letters exist

                while (upperLetters.exec(password) !== null) {
                    tempStrength += 2;
                    ++uletters;
                    //$log.info("uletters" + uletters);
                }

                //Check how many numbers exist

                while (numbers.exec(password) !== null) {
                    tempStrength += 1;
                    ++nnumbers;
                    //$log.info("numbers" + numbers);
                }

                //Check how many symbols exist
                while (symbols.exec(password) !== null) {
                    tempStrength += 3;
                    ++ssymbols;
                    //$log.info("symbols" + symbols);
                }


                //Make sure that the user's password containes characters from at least three out of the four categories
                if (!(lletters > 0 && uletters > 0 && ssymbols > 0 ||
                    lletters > 0 && uletters > 0 && nnumbers > 0 ||
                    uletters > 0 && ssymbols > 0 && nnumbers > 0 ||
                    lletters > 0 && ssymbols > 0 && nnumbers > 0)) {
                    tempStrength = 0;
                }
            }
            deferred.resolve(tempStrength);
            return deferred.promise;
        };//evaluatePassword

    });//angular_service
