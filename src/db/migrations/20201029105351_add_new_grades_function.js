exports.up = (knex, _) => knex.transaction(trx => {
    knex('efunction')
        .then(functionCodes => {

            const memberFunctionCodes = functionCodes.filter(functionCode => functionCode.efunctioncode.charAt(0) === 'R')

            knex('egradefunctionmapping').delete().transacting(trx)

            return knex('ecompanydefaultposition')
            .then(defaultPositions => {

                const adminGrades = []
                const memberGrades = []

                defaultPositions.forEach(defaultPosition => {
                    adminGrades.push(defaultPosition.eadmingradeid)
                    memberGrades.push(defaultPosition.emembergradeid)
                })

                const gradeFunctionMappings = []

                adminGrades.forEach(adminGrade => {

                    functionCodes.forEach(functionCode => {
                        const adminGradeFunction = {
                            egradeegradeid: adminGrade,
                            efunctionefunctioncode: functionCode.efunctioncode
                        }

                        gradeFunctionMappings.push(adminGradeFunction)
                    })

                })

                memberGrades.forEach(memberGrade => {

                    memberFunctionCodes.forEach(memberFunctionCode => {
                        const memberGradeFunction = {
                            egradeegradeid: memberGrade,
                            efunctionefunctioncode: memberFunctionCode.efunctioncode
                        }

                        gradeFunctionMappings.push(memberGradeFunction)
                    })

                })

                return knex('egradefunctionmapping').insert(gradeFunctionMappings).transacting(trx)

            })

        })
        .then(trx.commit)
        .catch(trx.rollback)
})

exports.down = (knex) => knex('egradefunctionmapping').delete();