const {getRPJWT} = require('../../lib/models/auth');

const {User} = require('../../lib/models/user.model');
const {HTTPStatus} = require('../../lib/helpers/HTTPStatus');

const common = require('./common');
const {test, agent, userAgent} = common;
const credentialsNewUser = common.credentials;
const before = test;


before('================ User model tests ===============', assert => {
  assert.end();
});

test('/v1/bla-bla', (assert) => {
  agent
    .get('/v1/bla-bla')
    .set('user-agent', userAgent)
    .expect(HTTPStatus.PAGE_NOT_FOUND)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.text, HTTPStatus.PAGE_NOT_FOUND_MESSAGE, HTTPStatus.PAGE_NOT_FOUND_MESSAGE);
      assert.end();
    });
});

test('/v1/users', (assert) => {
  agent
    .get('/v1/users')
    .set('user-agent', userAgent)
    .expect(HTTPStatus.UNAUTHORIZED)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.text, HTTPStatus.UNAUTHORIZED_MESSAGE, `Response message ${HTTPStatus.UNAUTHORIZED_MESSAGE}`);
      assert.end();
    });
});

test('/v1/users/login wrong email', assert => {
  agent
    .post('/v1/users/login')
    .set('user-agent', userAgent)
    .send({email: 'some data', grantType: 'password'})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.success, false, 'Body success=false');
      assert.equal(res.body.error, 'auth:invalid-email', 'Body error="auth:invalid-email"!');
      assert.end()
    })
});

let anonToken;
test('/v1/users/anonymous', assert => {
  agent
    .post('/v1/users/anonymous')
    .set('user-agent', userAgent)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      anonToken = res.body.data.token;
      const user = res.body.data.user;
      assert.equal(user.userId, 1, 'Body user.userId=1');
      assert.equal(user.anonymous, true, 'Body user.anonymous=true');
      assert.end()
    })
});

test('/v1/users/login wrong password', assert => {
  agent
    .post('/v1/users/login')
    .set('Authorization', anonToken)
    .set('user-agent', userAgent)
    .send({email: 'cc@cc.cc', grantType: 'password'})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.success, false, 'Body success=false');
      assert.equal(res.body.error, 'auth:wrong-password', 'Body error="auth:wrong-password"!');
      assert.end();
    });
});

const credentials = {
  email: 'cc@cc.cc',
  password: '123456',
  grantType: 'password',
};

test('/v1/users/login user not found', assert => {
  agent
    .post('/v1/users/login')
    .set('Authorization', anonToken)
    .set('user-agent', userAgent)
    .send(credentials)
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.success, false, 'Body success=false');
      assert.equal(res.body.error, 'auth:user-not-found', 'Body error="auth:user-not-found"!');
      assert.end();
    });
});

test('/v1/users/sign-up wrong email', assert => {
  agent
    .post('/v1/users/sign-up')
    .set('Authorization', anonToken)
    .set('user-agent', userAgent)
    .send({email: 'some data'})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.success, false, 'Body success=false');
      assert.equal(res.body.error, 'auth:invalid-email', 'Body error="auth:invalid-email"!');
      assert.end();
    });
});

test('/v1/users/sign-up wrong password', assert => {
  agent
    .post('/v1/users/sign-up')
    .set('Authorization', anonToken)
    .set('user-agent', userAgent)
    .send({email: credentials.email})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.error, 'auth:wrong-password', 'Body error="auth:wrong-password"!');
      assert.end();
    });
});

test('/v1/users/sign-up success', assert => {
  agent
    .post('/v1/users/sign-up')
    .set('Authorization', anonToken)
    .set('user-agent', userAgent)
    .send({email: credentials.email, password: credentials.password})
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.success, true, 'Body success=true');
      const user = res.body.data.user;
      assert.equal(user.userId, 1, 'Body user.userId=1!');
      assert.equal(user.anonymous, false, 'Body user.anonymous=false!');
      setTimeout(() => {
        assert.end();
      }, 500);
    });
});
let token;
let refreshToken;
let user;
test('/v1/users/login success by credentials', assert => {
  agent
    .post('/v1/users/login')
    .set('user-agent', userAgent)
    .send(credentials)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      const user = res.body.data.user;
      token = res.body.data.token;
      refreshToken = res.body.data.refreshToken;
      assert.equal(user.userId, 1, `Body user.userId=1`);
      setTimeout(() => assert.end(), 1000);
    });
});

test('/v1/users', (assert) => {
  agent
    .get('/v1/users')
    .set('Authorization', token)
    .set('user-agent', userAgent)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.pass('Successful response with users list');
      assert.end();
    });
});

let tokenApp2;
let refreshTokenApp2;
test('/v1/users/login to specific app', assert => {
  agent
    .post('/v1/users/login')
    .set('Cookie', 'APP=app2')
    .set('user-agent', userAgent)
    .send(credentials)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      const user = res.body.data.user;
      tokenApp2 = res.body.data.token;
      refreshTokenApp2 = res.body.data.refreshToken;
      assert.equal(user.userId, 1, `Body user.userId=1`);
      assert.equal(User.currentApp(user, 'app2').app.title, 'app2', `Current application is "app2"`);
      setTimeout(() => assert.end(), 500);
    });
});

test('/v1/users/login refresh token by not app2 token fail ', assert => {
  agent
    .post('/v1/users/login')
    .set('Cookie', 'APP=app2')
    .set('user-agent', userAgent)
    .send({token: refreshToken, grantType: 'refresh_token'})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.error, 'auth:invalid-refresh-token', 'Body error="auth:invalid-refresh-token"!');
      assert.end();
    });
});

test('/v1/users/login refresh token by app2 token success ', assert => {
  agent
    .post('/v1/users/login')
    .set('Cookie', 'APP=app2')
    .set('user-agent', userAgent)
    .send({token: refreshTokenApp2, grantType: 'refresh_token'})
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.pass('Refresh token for app "app2" is successful');
      assert.end();
    });
});

test('/v1/users/login refresh_token with not app token successful', assert => {
  agent
    .post('/v1/users/login')
    .set('user-agent', userAgent)
    .send({token: refreshToken, grantType: 'refresh_token'})
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      user = res.body.data.user;
      token = res.body.data.token;
      refreshToken = res.body.data.refreshToken;
      assert.equal(user.userId, 1, 'Body user.userId=1');
      setTimeout(() => assert.end(), 500);
    });
});

test('/v1/users/sign-up error', assert => {
  agent
    .post('/v1/users/sign-up')
    .set('user-agent', userAgent)
    .send({email: credentials.email, password: credentials.password})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.error, 'auth:user-exists', 'Body error="auth:user-exists"!');
      assert.end();
    });
});

test('/v1/users/logout without token failed', (assert) => {
  agent
    .get(`/v1/users/logout`)
    .set('user-agent', userAgent)
    .expect(HTTPStatus.UNAUTHORIZED)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.text, HTTPStatus.UNAUTHORIZED_MESSAGE, `Response message ${HTTPStatus.UNAUTHORIZED_MESSAGE}`);
      assert.end();
    });
});

test('/v1/users/logout', (assert) => {
  agent
    .get(`/v1/users/logout`)
    .set('user-agent', userAgent)
    .set('Authorization', token)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.pass('User logout successful');
      assert.end();
    });
});

test('/v1/users/1 delete unauthorized user fail', (assert) => {
  agent
    .delete(`/v1/users/${ user.userId }`)
    .set('user-agent', userAgent)
    .set('Authorization', token)
    .expect(HTTPStatus.UNAUTHORIZED)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.text, HTTPStatus.UNAUTHORIZED_MESSAGE, `Response message ${HTTPStatus.UNAUTHORIZED_MESSAGE}`);
      setTimeout(assert.end, 500);
    });
});

test('/v1/users/login again', assert => {
  agent
    .post('/v1/users/login')
    .set('user-agent', userAgent)
    .send(credentials)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      const user = res.body.data.user;
      token = res.body.data.token;
      assert.equal(user.userId, 1, 'Body user.userId=1');
      assert.end();
    });
});

test('/v1/users/change-password failed', assert => {
  agent
    .post('/v1/users/change-password')
    .set('user-agent', userAgent)
    .set('Authorization', token)
    .send({password: '1234567', newPassword: '234567'})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.error, 'auth:wrong-password', 'Body error="auth:wrong-password"!');
      assert.end();
    });
});

test('/v1/users/change-password with empty new password failed', assert => {
  agent
    .post('/v1/users/change-password')
    .set('user-agent', userAgent)
    .set('Authorization', token)
    .send({password: '1234567'})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.error, 'auth:new-password-does-not-provided', 'Body error="auth:new-password-does-not-provided"!');
      assert.end();
    });
});

test('/v1/users/change-password success', assert => {
  agent
    .post('/v1/users/change-password')
    .set('user-agent', userAgent)
    .set('Authorization', token)
    .send({password: credentials.password, newPassword: '234567'})
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.data, true, 'Password was changed successfully!');
      setTimeout(assert.end, 500);
    });
});

test('/v1/users/login with old password failed', assert => {
  agent
    .post('/v1/users/login')
    .set('user-agent', userAgent)
    .send(credentials)
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.error, 'auth:wrong-password', 'Body error="auth:wrong-password"!');
      assert.end();
    });
});

test('/v1/users/login with new password success', assert => {
  agent
    .post('/v1/users/login')
    .set('user-agent', userAgent)
    .send({...credentials, password: '234567'})
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      const user = res.body.data.user;
      token = res.body.data.token;
      assert.equal(user.userId, 1, 'Body user.userId=1');
      assert.end();
    });
});

test('/v1/users/reset/:app/:token reset password without repeat password failed', (assert) => {
  const resetToken = getRPJWT(user.userId);
  agent
    .post(`/v1/users/reset/app2/${escape(resetToken)}`)
    .set('user-agent', userAgent)
    .send({password: '234567'})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.error, 'auth:repeat-password-does-not-provided', 'Body error="auth:repeat-password-does-not-provided"!');
      assert.end();
    });
});

test('/v1/users/reset/:app/:token reset password with not equal repeat password failed', (assert) => {
  const resetToken = getRPJWT(user.userId);
  agent
    .post(`/v1/users/reset/app2/${escape(resetToken)}`)
    .set('user-agent', userAgent)
    .send({password: '234567', repeatPassword: '233'})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.error, 'auth:repeat-password-not-equal', 'Body error="auth:repeat-password-not-equal"!');
      assert.end();
    });
});
let newPassword = '345678';
test('/v1/users/reset/:app/:token reset password complete', (assert) => {
  const resetToken = getRPJWT(user.userId);
  agent
    .post(`/v1/users/reset/app2/${escape(resetToken)}`)
    .set('user-agent', userAgent)
    .send({password: newPassword, repeatPassword: newPassword})
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.pass('Password Changed Successful');
      assert.end();
    });
});

test('/v1/users/login after reset with old password failed', assert => {
  agent
    .post('/v1/users/login')
    .set('user-agent', userAgent)
    .send({...credentials, password: '234567'})
    .expect(HTTPStatus.SERVER_ERROR)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.error, 'auth:wrong-password', 'Body error="auth:wrong-password"!');
      assert.end();
    });
});


test('/v1/users/login with new reset password success', assert => {
  agent
    .post('/v1/users/login')
    .set('user-agent', userAgent)
    .send({...credentials, password: newPassword})
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      const user = res.body.data.user;
      token = res.body.data.token;
      assert.equal(user.userId, 1, 'Body user.userId=1');
      assert.end();
    });
});

test('/v1/users/1 delete', (assert) => {
  agent
    .delete(`/v1/users/${ user.userId }`)
    .set('user-agent', userAgent)
    .set('Authorization', token)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.pass('User deleted');
      assert.end();
    });
});

test('/v1/users/1 get by deleted user`s token', (assert) => {
  agent
    .get(`/v1/users/${ user.userId }`)
    .set('user-agent', userAgent)
    .set('Authorization', token)
    .expect(HTTPStatus.UNAUTHORIZED)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.text, HTTPStatus.UNAUTHORIZED_MESSAGE, `Response message ${HTTPStatus.UNAUTHORIZED_MESSAGE}`);
      assert.end();
    });
});

test('/v1/users/sign-up new user', assert => {
  agent
    .post('/v1/users/sign-up')
    .set('user-agent', userAgent)
    .send(credentialsNewUser)
    .expect(HTTPStatus.OK)
    .end((err, res) => {
      if (err) return assert.fail(JSON.stringify(res));
      assert.equal(res.body.success, true, 'Body success=true');
      const user = res.body.data.user;
      common.data.token = res.body.data.token;
      assert.equal(user.userId, 2, 'Body user.userId=2!');
      assert.equal(user.anonymous, false, 'Body user.anonymous=false!');
      assert.end();
    });
});

