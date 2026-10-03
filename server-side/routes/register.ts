export const RegisterFormInfo = {
  title:'Register',
  description:'use this form to register to your account',
  inputs:[{
    name:'email',
    type:'text',
    placeholder:'email'
  }, {
    name:'username',
    type:'text',
    placeholder:'username'
  }, {
    name:'password',
    type: 'password',
    placeholder:'password'
  }, {
    name:'type',
    type: 'number',
    placeholder:'type'
  }]
}

export const RegisterSuccessInfo = {
  title:'Register',
  description:'the registration was successful',
}

export const RegisterFailureInfo = {
  title:'Register',
  description:'the registration failed, those credentials are not correct',
}