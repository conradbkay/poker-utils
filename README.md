# poker-utils

Supports Omaha equity calculations

Numbers are never returned as percent values, i.e. 33% = 0.33

Using most of the equity functions will first load the 123 MB handRanks.dat

> **_NOTE:_**  You must download or generate a handRanks.dat file to use the equity utils

One can be found here: <https://github.com/chenosaurus/poker-evaluator/blob/master/data/HandRanks.dat>

You can either call the `init` function with the path to a handRanks file, or pass the path to every function you call
