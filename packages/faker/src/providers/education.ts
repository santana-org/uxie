import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class EducationProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random university name
   */
  university(): string {
    const prefixes = [
      "University of",
      "State University of",
      "National",
      "Royal",
      "Imperial",
      "Metropolitan",
    ]
    const parts = [
      "Oxford",
      "Cambridge",
      "Harvard",
      "Stanford",
      "Berkeley",
      "Princeton",
      "Yale",
      "MIT",
      "Cambridge",
      "London",
      "Boston",
      "Chicago",
    ]
    return `${this.random.pick(prefixes)} ${this.random.pick(parts)}`
  }

  /**
   * Generate a random degree name
   */
  degree(): string {
    const types = ["Bachelor", "Master", "PhD", "Associate", "Doctorate", "Professional"]
    const fields = [
      "Computer Science",
      "Business Administration",
      "Engineering",
      "Medicine",
      "Law",
      "Psychology",
      "Economics",
      "Literature",
      "Mathematics",
      "Physics",
      "History",
      "Philosophy",
    ]
    return `${this.random.pick(types)} of ${this.random.pick(fields)}`
  }

  /**
   * Generate a random field of study
   */
  fieldOfStudy(): string {
    const fields = [
      "Computer Science",
      "Business Administration",
      "Engineering",
      "Medicine",
      "Law",
      "Psychology",
      "Economics",
      "Literature",
      "Mathematics",
      "Physics",
      "History",
      "Philosophy",
      "Chemistry",
      "Biology",
      "Nursing",
      "Education",
      "Art",
      "Music",
    ]
    return this.random.pick(fields)
  }

  /**
   * Generate a random course name
   */
  course(): string {
    const subjects = [
      "Introduction to",
      "Advanced",
      "Fundamentals of",
      "Applied",
      "Theoretical",
      "Practical",
    ]
    const topics = [
      "Programming",
      "Data Science",
      "Web Development",
      "Machine Learning",
      "Database Design",
      "Software Engineering",
      "Cloud Computing",
      "Cybersecurity",
      "Mobile Development",
      "AI and Robotics",
    ]
    return `${this.random.pick(subjects)} ${this.random.pick(topics)}`
  }

  /**
   * Generate a random student ID
   */
  studentId(): string {
    const year = this.random.int(2020, 2024)
    const sequence = this.random.int(100000, 999999)
    return `STU-${year}-${sequence}`
  }

  /**
   * Generate a random grade (A+, A, B+, etc.)
   */
  grade(): string {
    const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"]
    return this.random.pick(grades)
  }

  /**
   * Generate a random GPA
   */
  gpa(): number {
    return Math.round(this.random.float(0, 4) * 100) / 100
  }

  /**
   * Generate a random school level
   */
  schoolLevel(): string {
    const levels = [
      "Elementary",
      "Middle School",
      "High School",
      "Undergraduate",
      "Graduate",
      "Postdoctoral",
    ]
    return this.random.pick(levels)
  }

  /**
   * Generate a random academic year
   */
  academicYear(): string {
    const start = this.random.int(2020, 2024)
    const end = start + 1
    return `${start}-${end}`
  }
}
