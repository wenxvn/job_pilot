import path from "node:path";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Education, Experience, Profile } from "@/types/profile";

const FONT_FAMILY = "Noto Sans SC";
const COLOR_TEXT = "rgb(16, 24, 40)";
const COLOR_SECONDARY = "rgb(106, 114, 130)";
const COLOR_MUTED = "rgb(153, 161, 175)";
const COLOR_ACCENT = "rgb(124, 92, 252)";
const COLOR_BORDER = "rgb(231, 234, 243)";
const COLOR_SURFACE = "rgb(249, 250, 251)";

Font.register({
  family: FONT_FAMILY,
  fonts: [
    {
      src: path.join(process.cwd(), "assets/fonts/NotoSansSC-Regular.woff"),
      fontWeight: 400,
    },
    {
      src: path.join(process.cwd(), "assets/fonts/NotoSansSC-Bold.woff"),
      fontWeight: 700,
    },
  ],
});

Font.registerHyphenationCallback((word) => Array.from(word));

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 44,
    paddingVertical: 42,
    fontFamily: FONT_FAMILY,
    fontSize: 9.5,
    lineHeight: 1.55,
    color: COLOR_TEXT,
  },
  header: {
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: COLOR_ACCENT,
  },
  name: {
    fontSize: 23,
    fontWeight: 700,
    lineHeight: 1.25,
  },
  role: {
    marginTop: 4,
    fontSize: 11,
    color: COLOR_ACCENT,
  },
  contactRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contact: {
    marginRight: 14,
    marginBottom: 3,
    color: COLOR_SECONDARY,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_BORDER,
    fontSize: 12,
    fontWeight: 700,
  },
  summary: {
    color: COLOR_SECONDARY,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skill: {
    marginRight: 6,
    marginBottom: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 3,
    backgroundColor: COLOR_SURFACE,
    color: COLOR_SECONDARY,
  },
  entry: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryHeading: {
    flex: 1,
    paddingRight: 12,
    fontWeight: 700,
  },
  entryDate: {
    color: COLOR_MUTED,
    fontSize: 8.5,
  },
  entryMeta: {
    marginTop: 2,
    color: COLOR_ACCENT,
  },
  entryDescription: {
    marginTop: 5,
    color: COLOR_SECONDARY,
    whiteSpace: "pre-wrap",
  },
  footer: {
    position: "absolute",
    right: 44,
    bottom: 22,
    color: COLOR_MUTED,
    fontSize: 8,
  },
});

function formatDate(value: string): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year) return value;
  return month ? `${year}.${month}` : year;
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate) || "至今";
  if (!start) return endDate ? end : "";
  return `${start} - ${end}`;
}

function ExperienceEntry({ experience }: { experience: Experience }) {
  return (
    <View style={styles.entry} wrap={false}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryHeading}>{experience.role || "工作经历"}</Text>
        <Text style={styles.entryDate}>
          {formatDateRange(experience.start_date, experience.end_date)}
        </Text>
      </View>
      {experience.company && <Text style={styles.entryMeta}>{experience.company}</Text>}
      {experience.description && (
        <Text style={styles.entryDescription}>{experience.description}</Text>
      )}
    </View>
  );
}

function EducationEntry({ education }: { education: Education }) {
  const detail = [education.degree, education.major].filter(Boolean).join(" · ");

  return (
    <View style={styles.entry} wrap={false}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryHeading}>{education.school || "教育经历"}</Text>
        <Text style={styles.entryDate}>
          {formatDateRange(education.start_date, education.end_date)}
        </Text>
      </View>
      {detail && <Text style={styles.entryMeta}>{detail}</Text>}
    </View>
  );
}

function ResumeDocument({ profile }: { profile: Profile }) {
  const contactItems = [profile.email, profile.phone, profile.location, profile.linkedin_url].filter(Boolean);

  return (
    <Document title={`${profile.full_name || "个人"}简历`} author={profile.full_name || "JobPilot 用户"}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name || "个人简历"}</Text>
          {profile.target_role && <Text style={styles.role}>{profile.target_role}</Text>}
          {contactItems.length > 0 && (
            <View style={styles.contactRow}>
              {contactItems.map((item) => (
                <Text key={item} style={styles.contact}>{item}</Text>
              ))}
            </View>
          )}
        </View>

        {profile.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>个人简介</Text>
            <Text style={styles.summary}>{profile.bio}</Text>
          </View>
        )}

        {profile.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>专业技能</Text>
            <View style={styles.skills}>
              {profile.skills.map((skill) => (
                <Text key={skill} style={styles.skill}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {profile.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>工作经历</Text>
            {profile.experience.map((experience) => (
              <ExperienceEntry key={experience.id} experience={experience} />
            ))}
          </View>
        )}

        {profile.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>教育经历</Text>
            {profile.education.map((education) => (
              <EducationEntry key={education.id} education={education} />
            ))}
          </View>
        )}

        <Text
          fixed
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>
    </Document>
  );
}

export async function renderProfileResume(profile: Profile): Promise<Buffer> {
  return renderToBuffer(<ResumeDocument profile={profile} />);
}
