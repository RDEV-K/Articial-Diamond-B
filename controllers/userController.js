const userRepository = require('../repositories/userRepository');
const bcrypt = require("bcrypt");
const _ = require("lodash");
require('dotenv').config();
const axios = require('axios');
const qs = require('qs');
const path = require('path');
const fs = require('fs');

class UserController {
  async getAllUsers(request, reply) {
    try {
      const users = await userRepository.findAll();
      return users;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async getAllActiveUsers(request, reply) {
    try {
      const users = await userRepository.findAllActive();
      return users;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async getAllSellers(request, reply) {
    try {
      const users = await userRepository.findAllSellers();
      return users;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async getAllActiveSellers(request, reply) {
    try {
      const users = await userRepository.findAllActiveSellers();
      return users;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async getAllBuyers(request, reply) {
    try {
      const users = await userRepository.findAllBuyers();
      return users;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async getAllActiveBuyers(request, reply) {
    try {
      const users = await userRepository.findAllActiveBuyers();
      return users;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async createUser(request, reply) {
    try {
      const bodies = request.body
      const data = {};
      let fieldName;
      const bodyArray = Array.isArray(bodies) ? bodies : Object.values(bodies);
      
      await Promise.all(bodyArray.map(async (body) => {
        if (body.file) {
            // Process the file
            const filename = `${Date.now()}-${body.filename}`;
            const filepath = path.join(__dirname, '../uploads', filename); // Ensure this directory exists

            // Pipe the file to the desired location
            body.file.pipe(fs.createWriteStream(filepath));

            // Store file info in data object
            fieldName = body.fieldname;
            data[fieldName] = filepath;
        } else {
            if (body.fieldname === "password") {
              fieldName = body.fieldname;
              data[fieldName] = await bcrypt.hash(body.value, 10);
            } else {
              fieldName = body.fieldname;
              data[fieldName] = body.value;
            }
        }
      }));

      const existingUser = await userRepository.findOne({ where: { "email": data.email } });

      if(existingUser) {
        return reply.status(400).send({ errorEmailAdressText: 'Email already exists' });
      }

      const user = await userRepository.create(data);
      return user;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async userLogin(request, reply) {
    const { email, password } = request.body;
    const fastify = request.server;
    try {
      // Find user in the "database"
      const user = await userRepository.findUser({ email });
      if (!user) {
        return reply.code(400).send({ error: 'Invalid username or password' });
      }
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reply.code(400).send({ error: 'Invalid username or password' });
      }
      // Generate a JWT token with an expiration time
      const token = fastify.jwt.sign(
        { id: user.id, username: user.username },
        { expiresIn: '1h' } // Token expires in 1 minute
      );
      // console.log(token);
      return reply.send({ status: true, message: "Login successfully.", data: { token, user: _.omit(user, 'password') } });
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async userLogout(request, reply) {
    const { id } = request.params;
    try {
      // Find user in the "database"
      const user = await userRepository.findById(id);
      if (!user) {
        return reply.code(400).send({ error: 'Invalid user' });
      }
      return reply.code(200).send('Logged out successfully');
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async googleLogin(request, reply) {
    try{
    const params = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URI,
      response_type: 'code',
      scope: 'profile email',
    };
    const url = process.env.GOOGLE_OTH2_URL + `auth?${qs.stringify(params)}`;
  return url;
    // reply.redirect(url);
  } catch(err){
    console.log('err',err);
    return err;
  }
  }

  async googleCallback(request, reply) {
    const code = request?.query?.code;

    // Exchange code for access token
    try {
      const tokenResponse = await axios.post(process.env.GOOGLE_TOKEN_URL, {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
      });

      const accessToken = tokenResponse.data.access_token;
      const userInfoResponse = await axios.get(process.env.GOOGLE_USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      var password = await bcrypt.hash('123456', 10);
      let user = await userRepository.findOne({where:{ email: userInfoResponse.data.email }});
      if(!user) {
          user = await userRepository.create({
            username: userInfoResponse.data.name,
            email: userInfoResponse.data.email,
            password,
            isSeller: true,
            active: true,
          });
      }

      const fastify = request.server;
      // Generate a JWT token with an expiration time
      const token = fastify.jwt.sign(
        { id: user?.id, username: user?.username },
        { expiresIn: '1h' } // Token expires in 1 minute
      );
      return reply.send({ status: true, message: "Login successfully.", data: { token, user: _.omit(user, 'password') } });

    } catch (error) {
      console.error('Error exchanging code for access token:', error?.response?.data);
      reply.status(500).send('Failed to authenticate with Google.');
    }
  }

  async updateUser(request, reply) {
    try {
      const {
        username,
        companyName,
        profileImage,
        isBuyer,
        isSeller
      } = request.body;
      let user = await userRepository.findById(request.params.id);
      if(user){
        user = await user.update({
          username: username,
          companyName: companyName,
          profileImage: profileImage,
          isBuyer: isBuyer,
          isSeller: isSeller
        });
        return user;
      } else {
        return reply.code(400).send({ error: 'User Not Found' });
      }
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  // Add more controller methods as needed
}

module.exports = new UserController();
