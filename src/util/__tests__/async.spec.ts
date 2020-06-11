import { runQueue } from '../async'

describe('Async utils', () => {
    describe('runQueue', () => {
        it('should work', done => {
            const calls:number[] = []
            const queue = [1, 2, 3, 4, 5].map((i:number) => (next:Function) => {
                calls.push(i)
                setTimeout(next, 0)
            })
            runQueue(queue, (fn:Function, next:Function) => fn(next), () => {
                expect(calls).toEqual([1, 2, 3, 4, 5])
                done()
            })
        })
    })
})
