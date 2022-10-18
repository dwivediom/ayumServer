const  mongoose = require('mongoose');
const Schema = mongoose.Schema;
 

const ProfileSchema = new mongoose.Schema({ 


    doctor :{ 
        type :  mongoose.Schema.Types.ObjectId, 
        ref: "doctor"
    }, 
    clinic:{ 
        type: String, 
    }, 
    website:{ 
        type: String, 
    }, 
    location:{ 
        type: String, 
        required: true, 
    }, 
    timing:{ 
        type: String, 
        required: true, 
    }, 
    status:{ 
        type: String, 
      required: true, 
    }, 
    specialists: { 
        type: String, 

    } , 
    fees : { 
        type: String, 
    },
    bio: { 
        type: String, 
    }, 
    patients:[
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
              },
              bookingId: {
                type: Number
              },
              patientname: {
                  type: String,
                  required: true
              },
              fathername: {
                type: String,
              },
              status: {
                  type: String,
              },
              age: {
                  type: Number,
      
              },
              date: {
                type: Date,
              },
              description: {
                  type: String,
                  required: true
              },
              name: {
                  type: String
              },
              avatar: {
                  type: String
              },
              date: {
                  type: Date,
                  default: Date.now
              }
        }
    ], 
    review: [
        { 
            user: {
                type:Schema.Types.ObjectId, 
                ref: 'users', 
            } , 
            text :{ 
                type:String, 
                required:true, 

            }, 
            name : {
                type:String, 
            }, 
            avatar:{ 
                type:String, 

            }, 
            date: {
                type:Date,
                default:Date.now
            } 
            
        }
    ], 
    experiance:[
        {
            position:{ 
                type: String, 
            }, 
            medical:{ 
                type: String, 
            }, 
            location:{ 
                type: String, 
            } , 
            from:{
                type: Date,  

            },
            to:{ 
                type: Date, 

            },
            currrent:{ 
                type:Boolean, 
                default: false, 
            }, 
            description:{ type: String, } , 

        }
    ], 

    education: [
     {
        school:{ 
            type:String,       
        }, 
        degree:{ 
            type: String, 
        } , 
        fieldofstudy:{ 
            type: String,   
        }, 
        form:{
            type:Date,
        }, 
        to :{ 
            type:Date, 
        }, 
        currrent: { 
            type:Boolean, 
            default:false, 
        }, 
        description:{ type: String, } 
     }
    ], 
    social:{
        youtube:{ 
            type:String, 
        }, 
        twitter:{ 
            type:String, 
         }, 
         facebook:{ 
            type:String, 
         }, 
         instagram:{
            type:String, 
         }

    }, 
    date:{ 
        type:Date, 
        default:Date.now
    }

}); 

module.exports = Profile = mongoose.model('profile',ProfileSchema);
 