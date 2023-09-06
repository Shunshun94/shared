use Encode;
use JSON;

my @array = ();

// %races をまるまるコピペ
// from https://github.com/yutorize/ytsheet2/blob/develop/_core/lib/sw2/data-races.pl

foreach my $key(keys(%races)) {
    print '"' . $key . '":' . decode('utf-8', encode_json( $races{$key} ));
    print ',';
}
