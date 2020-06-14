import config from '../../config/production.config';

it('production config', () => {
  
  expect(config).toEqual({
    isProd: true,
    backend: {
      searchApiPrefix: 'https://api.github.com/search'
    },
    repos: {
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
      languages: ['JavaScript','HTML','CSS','TypeScript','C','C#','C++','Clojure','Dart','Elixir','GDScript','Go','HCL','Haskell','Java','Jupyter Notebook','Kotlin','Lua','Makefile','PHP','Python','Rust','Scala','Shell','Swift']
    }
  });

});
