const coins = Workspace.WaitForChild('World').WaitForChild('Coins').GetChildren();
coins.forEach((coin) => {
  if (coin.IsA('BasePart')) {
    print(`Coin found: ${coin.Name}`);
  }
});
