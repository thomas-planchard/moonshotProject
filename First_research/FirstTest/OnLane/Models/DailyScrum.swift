
import SwiftUI

struct DailyScrum: Identifiable{
    let id: UUID
    var title : String
    var attendees: [String]
    var lenghtMinutes : Int
    var theme : Theme
    
    init(id: UUID = UUID(), title: String, attendees: [String], lengthMinutes: Int, theme: Theme) {
        self.id = id
        self.title = title
        self.attendees = attendees
        self.lenghtMinutes = lengthMinutes
        self.theme = theme
        
    }
        
}
extension DailyScrum {
    static let sampleData: [DailyScrum] =
    [
        DailyScrum(title: "Design", attendees: ["Cathy", "Daisy", "Simon", "Jonathan"], lengthMinutes: 10, theme: .yellow),
        DailyScrum(title: "App Dev", attendees: ["Katie", "Gray", "Euna", "Luis", "Darla"], lengthMinutes: 5, theme: .orange),
        DailyScrum(title: "Web Dev", attendees: ["Chella", "Chris", "Christina", "Eden", "Karla", "Lindsey", "Aga", "Chad", "Jenn", "Sarah"], lengthMinutes: 5, theme: .poppy)
    ]
}

