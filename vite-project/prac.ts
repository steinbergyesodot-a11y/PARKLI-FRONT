import {z} from 'zod'


const userScema = z.object({
    name: z.string(),
    age: z.number().int().positive()
})

userScema.parse({
    name: "yosef",
    age: 45
})

console.log(userScema)