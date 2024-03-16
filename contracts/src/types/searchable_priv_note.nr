// docs:start:token_types_all
use dep::aztec::prelude::{NoteHeader, NoteInterface, PrivateContext};
use dep::aztec::log::emit_unencrypted_log_from_private;
use dep::aztec::{note::{utils::compute_note_hash_for_consumption}, hash::{compute_secret_hash, pedersen_hash}};
use dep::aztec::oracle::rand::rand;

global SEARCHABLE_PRIV_NOTE_LEN: Field = 2;

// Transparent note represents a note that is created in the clear (public execution),
// but can only be spent by those that know the preimage of the "secret_hash"
struct SearchablePrivNote {
    value: Field,

    // randomness of the note to hide contents.
    randomness: Field,

    // header is just here to satisfy the NoteInterface
    header: NoteHeader,
}

impl NoteInterface<SEARCHABLE_PRIV_NOTE_LEN> for SearchablePrivNote {
    fn serialize_content(self) -> [Field; SEARCHABLE_PRIV_NOTE_LEN] {
        [
            self.value,
            self.randomness,
        ]
    }

    fn deserialize_content(serialized_SearchablePrivNote: [Field; SEARCHABLE_PRIV_NOTE_LEN]) -> Self {
        Self {
            value: serialized_SearchablePrivNote[0],
            randomness: serialized_SearchablePrivNote[1],
            header: NoteHeader::empty(),
        }
    }

    fn compute_note_content_hash(self) -> Field {
        // TODO(#1205) Should use a non-zero generator index.
        pedersen_hash(self.serialize_content(), 0)
    }

    fn compute_nullifier(self, _context: &mut PrivateContext) -> Field {
        self.compute_nullifier_without_context()
    }

    fn compute_nullifier_without_context(self) -> Field {
        let siloed_note_hash = compute_note_hash_for_consumption(self);
        // TODO(#1205) Should use a non-zero generator index.
        // TODO: check that randomness is ok to use here
        pedersen_hash([self.randomness, siloed_note_hash],0)
    }

    fn set_header(&mut self, header: NoteHeader) {
        self.header = header;
    }

    fn get_header(self) -> NoteHeader {
        self.header
    }

    fn broadcast(self, context: &mut PrivateContext, slot: Field) {
        emit_unencrypted_log_from_private(context, self.serialize_content());
    }

    fn get_note_type_id() -> Field {
        // TODO(#4519): autogenerate
        // python -c "print(int(''.join(str(ord(c)) for c in 'TransparentNote')))"
        84114971101151129711410111011678111116100
    }
}

impl SearchablePrivNote {
    pub fn new() -> Self {
        SearchablePrivNote {
            value: 1,
            randomness: rand(),
            header: NoteHeader::empty(),
        }
    }
}
