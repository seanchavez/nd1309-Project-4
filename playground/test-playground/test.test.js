describe('Asynchronous tests', () => {
  it('async using callback', done => {
    setTimeout(done, 100);
  });

  it('async with promises', () => {
    return new Promise(resolve => setTimeout(resolve, 100));
  });

  it('async with async/await', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });
});
